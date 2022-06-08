const StorageNames = ['sessionStorage', 'localStorage']
const cache = {
  token: StorageNames.map(k => window[k].getItem('token')).find(v => !!v),
}
/**页面打开期间的token管理对象，避免每次获取都读取硬盘*/
export default {
  /**
   * 从缓存获取token
   * @returns {string|null}
   */
  get() {
    return cache.token
  },
  /**
   * 存储token
   * @param {string} token
   * @param {boolean} isRemember true 长期保存，false 临时保存
   */
  set(token, isRemember = false) {
    let key = isRemember ? 'localStorage' : 'sessionStorage'
    window[key].setItem('token', token)
    cache.token = token
  },
  /**移除token */
  remove() {
    StorageNames.map(k => window[k].removeItem('token'))
    cache.token = null
  },
}
