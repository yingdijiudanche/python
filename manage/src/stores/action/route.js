import { INIT_ROUTES, SEARCH_ROUTES, TRANSLATE_ROUTES } from '../actionTypes'
import api from '../../api/route'

export const getRoutes = roleId => async dispatch => {
  let res = await api.getAllByRoleId(roleId)
  if (res.code) throw Error('请求菜单时出错，原因:' + res.msg)
  dispatch(updateRoutes(res.data))
}
/** @param {Array} payload */
export const updateRoutes = payload => ({ type: INIT_ROUTES, payload })

export const translateRoutes = () => ({ type: TRANSLATE_ROUTES })

/**@param {{name:string?,path:string?}}  payload*/
export const searchRoutes = payload => ({ type: SEARCH_ROUTES, payload })
