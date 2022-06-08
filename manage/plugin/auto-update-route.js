import nodePath from 'path'

const PLUGIN_NAME = 'vite-plugin-update-route'
const EVENT_NAME = 'plugin-update-route'
/** @enum {string} */
const ACTION_TYPES = {
  delete: 'delete',
  add: 'add',
}

/**
 * @param {Config} config
 * @returns {import('vite').Plugin}
 */
export default function autoUpdateRoute({ folder, suffix, handler }) {
  let fullPath = ''
  let root = ''
  let deledLinks = []
  let invokeId = null
  const slash = path => path.split(nodePath.sep).join('/')

  /** @param {import('vite').ViteDevServer} server */
  function deleOne(server) {
    return function (path) {
      path = slash(path)
      if (path.substr(0, fullPath.length) !== fullPath) return
      deledLinks.push(path.substr(root.length))
      let temp = path.replace(fullPath, '').replace(suffix, '')

      server.ws.send({
        type: 'custom',
        event: EVENT_NAME,
        data: { path: temp, action: ACTION_TYPES.delete },
      })
    }
  }
  /** @param {import('vite').ViteDevServer} server */
  function addOne(server) {
    return function (path) {
      path = slash(path)
      if (path.substr(0, fullPath.length) !== fullPath) return

      let deleIndex = deledLinks.indexOf(path.substr(root.length))
      if (deleIndex >= 0) {
        // console.log('clear delete recode',path)
        deledLinks = [
          ...deledLinks.slice(0, deleIndex),
          ...deledLinks.slice(deleIndex + 1),
        ]
      }
      let temp = path.replace(fullPath, '').replace(suffix, '')
      server.ws.send({
        type: 'custom',
        event: EVENT_NAME,
        data: { path: temp, action: ACTION_TYPES.add },
      })
    }
  }
  return {
    name: PLUGIN_NAME,

    configResolved(config) {
      root = config.root
      fullPath = slash(nodePath.resolve(root, folder))
      invokeId = new RegExp(handler.id)
    },
    transform: function (code, id) {
      if (!invokeId.test(id)) return code
      const afterCode = `
        \n
        function ${String(handler.onUpdate)}
        \nif (import.meta.hot) {
          import.meta.hot.on('${EVENT_NAME}', (data) => {
            onUpdate(data)
          })
        }
        `
      let preCode = (handler.imports ?? []).join('\n')

      return preCode + '\n' + code + afterCode
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (deledLinks.includes(req.url.split('?')[0])) {
          console.log(req.url)
          res.setHeader('Content-Type', 'text/javascript')
          res.end()
        } else {
          next()
        }
      })
      server.watcher.on('add', addOne(server))
      server.watcher.on('unlink', deleOne(server))
    },
  }
}
/**
 * @typedef {object} Config
 * @property {string} folder
 * @property {string} suffix
 * @property {Handler} handler
 */
/**
 * @typedef {object} Handler
 * @property {string} id
 * @property {string[]} imports
 * @property {(path:string,action:ACTION_TYPES)=>void} onUpdate
 */
