import axios from 'axios'
import tokenHolder from './tokenHolder'
// import baseConfig from '../config/base';
import { message } from 'antd'
import encode2dsl from './encode2dsl'
const request = axios.create({
  // baseURL: `${baseConfig.ApiDomain}/api/back`,//
  baseURL: '/api/back',
  timeout: 60000, // 请求超时时间
  paramsSerializer: encode2dsl,
})

request.interceptors.request.use(config => {
  config.headers['Authorization'] = tokenHolder.get()
  return config
}, err)

request.interceptors.response.use(
  response => Promise.resolve(response.data),
  err
)

function err(error) {
  let { message: msg, response } = error
  let code = -1
  if (response) {
    let { status, data } = response
    code = status
    if (code === 401) {
      //token 失效
      message.error(data, () => {
        tokenHolder.remove()
        window.location.replace('/')
      })
      return Promise.reject(error)
    }
  }
  return Promise.resolve({ code, msg })
}
export default request
