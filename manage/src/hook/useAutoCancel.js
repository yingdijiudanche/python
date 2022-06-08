import Axios from 'axios'
import { useEffect, useRef } from 'react'

const CancelMsg = 'canceled'

/**
 * 创建一个自动取消的请求函数
 *
 * 通过传入的```fn```参数 获取cancelToken
 *
 * 第三个参数开始，是调用时传入的参数
 * @param {(
 * cancelToken:import('axios').CancelToken,
 * isCanceled:(msg:string)=>boolean,
 * ...args)=>Promise} fn
 */
export default function useAutoCancel(fn) {
  /**@type {import('react').MutableRefObject<import('axios').CancelTokenSource>} */
  const cancelTokenRef = useRef(null)

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel(CancelMsg)
      }
    } // 防止快速轉頁時報錯
  }, [])

  const fetchDatas = async (...args) => {
    if (cancelTokenRef.current === null) {
      cancelTokenRef.current = Axios.CancelToken.source()
    } else {
      cancelTokenRef.current.cancel()
      cancelTokenRef.current = Axios.CancelToken.source()
    }

    return fn.apply(fn, [
      cancelTokenRef.current.token,
      msg => msg === CancelMsg,
      ...args,
    ])
  }

  return fetchDatas
}
