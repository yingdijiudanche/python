export default {
  folder: './src/views/lazy',
  suffix: '.jsx',
  handler: {
    id: './src/App.jsx',
    imports: [
      "import { getRoutes } from './stores/action/route';",
      "import routeApi from './api/route';",
    ],
    onUpdate({ path, action }) {
      console.log(path)
      if (/copy/.test(path)) return
      let state = store.getState()
      const after = () => {
        let roleId = state.admin.info.roleId
        if (!roleId) return
        getRoutes(roleId)(store.dispatch)
      }
      switch (action) {
        case 'delete':
          const getRouteIds = routes => {
            for (let i = 0; i < routes.length; i++) {
              const route = routes[i]
              if (route.path === path) return [route._id]
              const child = route.children.find(v => v.path === path)
              if (child) {
                return [child._id, route._id]
              }
            }
          }
          const [id, pid] = getRouteIds(state.route.rawDatas) ?? []
          console.log('delete=>', id)
          if (!id) return console.error(`Target route [${path}] not found!`)
          routeApi.dele(id, pid).then(after)
          break
        case 'add':
          const arr = path.split('/')
          const isModifyPage = /modify$/.test(path)
          const name = isModifyPage
            ? arr.reverse().join(' ')
            : arr.filter(s => s != 'index').join(' ')
          const isIndexPage = /index$/.test(path)
          let parentId
          if (!isIndexPage) {
            //非 index page 默认跟随index的父级
            const pathArr = path.split('/')
            pathArr.pop()
            pathArr.push('index')
            const indexPath = pathArr.join('/')
            const findParentId = routes => {
              for (let i = 0; i < routes.length; i++) {
                const route = routes[i]
                const child = route.children.find(v => v.path === indexPath)
                if (child) {
                  return route._id
                }
              }
            }
            parentId = findParentId(state.route.rawDatas)
          }
          const entity = {
            path,
            name,
            sort: 0,
            component: path.substr(1),
            isMenu: !isModifyPage,
          }

          routeApi
            .add(entity, parentId)
            .then(after)
            .catch(e => console.error('Auto Update Route->', e.message))
          break
        default:
          break
      }
    },
  },
}
