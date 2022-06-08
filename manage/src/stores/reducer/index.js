import { combineReducers } from 'redux'
/**
 * 导出当前目录下的.js 文件。
 *  @see https://cn.vitejs.dev/guide/features.html#glob-%E5%AF%BC%E5%85%A5 */

const modules = import.meta.globEager('./*.js')
const allReducer = {}
const nameReg = /[^*/]+(?=.js)/

for (const path in modules) {
  let key = nameReg.exec(path)
  allReducer[key] = modules[path].default
}

//自动注册当前目录下所有 reducer
export default combineReducers(allReducer)
