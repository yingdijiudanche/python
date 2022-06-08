/**
 * @description
 * 用于匹配是否modify页面的正则表达式，
 * 并未统一定义。若要更改匹配规则，
 * 请全局搜索 /\/modify$/
 *
 */

import intl from 'intl-lightly'

var previous = '/'
const isModifyPage = url => /\/modify$/.test(url)
/**@type {Route[]} */
var curCrumbs = []

/**
 * 路由变化时更新面包屑
 * @param {Location} location 来自 react-route-dom
 * @param {Route[]} routes 当前账号拥有的全部有效路由
 * @param {[Crumb]} HomeCrumb 第一个面包屑
 */
export default function (location, routes, HomeCrumb) {
  const { pathname } = location

  if (pathname === '/') {
    //首页
    previous = HomeCrumb[0].path
    return HomeCrumb
  }
  if (pathname === '/login') {
    //重新登陆
    curCrumbs = []
    previous = '/'
    return curCrumbs
  }

  if (previous === pathname) return curCrumbs //重复点击

  const before = curCrumbs.findIndex(v => v.path === pathname)
  if (before > -1) {
    //后退
    // if (before === 0) {
    //   curCrumbs = [curCrumbs[0]];
    // } else {
    //   curCrumbs = curCrumbs.slice(before);
    // }
    curCrumbs.pop()
    previous = pathname
    return [...curCrumbs]
  }

  let link = routes.find(v => v.path === pathname)
  if (!link) return curCrumbs //边界情况

  //前进
  link = makeOne(location, link)

  curCrumbs = pickSamePrefix(link)

  previous = link.path

  return curCrumbs
}
function pickSamePrefix(link) {
  // const matchAfterLastSlashReg = /[^.*/]+$/;

  // const cur = link.path.replace(matchAfterLastSlashReg, ''); // '/admin/index' => '/admin/'
  // const last = previous.replace(matchAfterLastSlashReg, '');
  const matchFirstReg = /[^.*/]+/
  const cur = matchFirstReg.exec(link.path)[0]
  let last = matchFirstReg.exec(previous)
  last = last ? last[0] : null
  const curReg = new RegExp(cur)
  //url最后一个/之前的内容不一样 会被抛弃
  if (last !== cur && curCrumbs.length > 0) {
    let pure = curCrumbs.filter(v => curReg.test(v))
    return [...pure, link]
  }
  return [...curCrumbs, link]
}
/**创建一个面包屑 */
function makeOne(location, link) {
  const { state = {} } = location
  let { _id, path, name } = link

  if (isModifyPage(path)) {
    //前往编辑
    let key = path.replace(/\/modify$/, '')
    let isEdit = 'editData' in state
    let sufix = isEdit ? 'edit' : 'add'
    name = intl.getReplaced(`routes.common.${sufix}`, {
      name: intl.get(`routes.${key}`),
    })
    // if ('editData' in state) {//单语言环境时
    //   name = name.replace('编辑', '添加')
    // }
  }
  if (state) {
    const { customTitle } = state
    if (customTitle) {
      //自定义标题
      name = customTitle
    }
  }
  link = { _id, path, name }
  return link
}

/**
 * 切换语言后，翻译当前的面包屑
 */
export function updateCrumb(defoLinks, location) {
  //arr的值取决于用户是否刷新了页面
  let arr = curCrumbs.length ? curCrumbs : defoLinks
  arr.forEach(v => {
    if (isModifyPage(v.path)) return
    v.name = intl.get(`routes.${v.path}`) || v.name
  })
  return arr.map(link => makeOne(location, link))
}

/**
 * @typedef {Object} Route
 *
 *@property {number} _id
 *@property {number} sort
 *@property {number} pid
 *@property {string} path
 *@property {string} component
 *@property {string} name
 *@property {boolean} isMenu
 */
/**
 * @typedef {object} Crumb
 * @property {number} _id
 *@property {string} path
 *@property {string} name
 *
 */
