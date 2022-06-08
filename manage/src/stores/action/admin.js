import { UPDATE_ADMIN, LOGIN_ERROR, LOGGING } from '../actionTypes'
import api from '../../api/admin'
import tokenHolder from '../../utils/tokenHolder'

export const updateAdmin = adminInfo => ({
  type: UPDATE_ADMIN,
  payload: adminInfo,
})
export const setLoginErr = msg => ({ type: LOGIN_ERROR, payload: msg })
export const setLogging = () => ({ type: LOGGING })

export const login = params => async dispatch => {
  dispatch(setLogging())
  let res = await api.login(params)

  if (res.code) return dispatch(setLoginErr(res.msg))
  let { admin, token } = res.data || {}
  tokenHolder.set(token, params.remember_me)

  dispatch(updateAdmin(admin))
}

export const initByToken = () => async dispatch => {
  dispatch(setLogging())
  let token = tokenHolder.get()

  let res = await api.getByToken(token)
  if (res.code) return dispatch(setLoginErr(res.msg))

  dispatch(updateAdmin(res.data))
}
