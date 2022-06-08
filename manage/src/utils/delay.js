/**
 * 防抖
 * @param {Number} time
 * @param {(...args)=>void} fn
 */
export function debounce(time, fn) {
  let timeout
  return function (...rest) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(fn, time, ...rest)
  }
}

/**
 * 节流
 * @param {Number} time
 * @param {(...args)=>void} fn
 */
export function throttle(time, fn) {
  let timeout
  let firstInvoke = true
  return function (...rest) {
    if (firstInvoke) {
      fn()
      firstInvoke = false
      return
    }
    if (timeout) return
    timeout = setTimeout(fn, time, ...rest)
  }
}
