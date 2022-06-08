/** 所有state action都写在这里，保证唯一。
 * 并且任何人通过这个文件可以看到整个app会做哪些操作
 * 使用jsdoc 注释，在其他文件引用时才能看到智能提示
 * 不同的state action 用两个空行隔开
 * */

/** 更新管理员信息 payload = Object */
export const UPDATE_ADMIN = 'UPDATE_ADMIN'
/** 登录出错 payload = String */
export const LOGIN_ERROR = 'LOGIN_ERROR'
/** 正在登录 */
export const LOGGING = 'LOGGING'

/** 更新路由菜单 payload = Array */
export const INIT_ROUTES = 'INIT_ROUTES'

/** 翻译菜单名称(切换语言时) payload = {local:string} */
export const TRANSLATE_ROUTES = 'TRANSLATE_ROUTES'

export const SEARCH_ROUTES = 'SEARCH_ROUTES'
