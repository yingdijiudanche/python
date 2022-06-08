import { message } from 'antd'
import { useState, useEffect } from 'react'
import useParamsCache from './useParamsCache'
import useAutoCancel from './useAutoCancel'

/**
 * 过滤total，部分属性名更换
 * @param {CacheRefShape} params
 * @returns {SendParams}
 */
const simplify = function (params = {}) {
  let { total, current, pageSize, ...rest } = params
  rest.page = current
  rest.limit = pageSize
  return rest
}

const genDefoState = function (pageSize = 10) {
  return {
    loading: false,
    pagination: { current: 1, pageSize, total: 0 },
    dataSource: [],
  }
}

const remakeState = function (res) {
  let { pageSize, current, total, data } = res
  return {
    loading: false,
    pagination: { current, pageSize, total },
    dataSource: data,
  }
}

/**@type {ConfigOfUseListPage} */
const defaultConfig = { staticParams: {}, baseParams: {} }

/**
 * 一个为分页展示定制的hook，包含 获取列表数据，删除一条数据，筛选数据
 * @param {{getList:(params,cancelToken?)=>Promise,dele:(id)=>Promise}} api
 * @param {ConfigOfUseListPage} config 如果有路由参数，放进staticParams
 */
export default function useListPage(
  api,
  { pageSize, staticParams, baseParams } = defaultConfig
) {
  const [dataState, setDataState] = useState(() => genDefoState(pageSize))

  /**@type {import('react').MutableRefObject<CacheRefShape>} */
  const cacheRef = useParamsCache()

  const fetchDatas = useAutoCancel(async (cancelToken, isCanceled, params) => {
    setDataState(s => ({ ...s, loading: true }))
    let res = await api.getList(simplify(params), cancelToken)

    if (res.code) {
      if (isCanceled(res.msg)) return
      message.error(res.msg)
      return
    }

    cacheRef.current = params
    setDataState(remakeState(res))
  })

  useEffect(() => {
    let params = cacheRef.current ? cacheRef.current : dataState.pagination
    fetchDatas({ ...params, ...baseParams, ...staticParams })
  }, [])

  const handleTableChange = ({ current, pageSize }, filters, sorts) => {
    let lastParams = cacheRef.current || {}
    let params = {
      ...lastParams,
      current: current === 0 ? 1 : current,
      pageSize,
      ...filters,
    }
    params.sort = sorts.order ? { [sorts.field]: sorts.order } : baseParams.sort
    fetchDatas({ ...params, ...staticParams })
  }

  const deleOne = id => async () => {
    let res = await api.dele(id)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    if (dataState.dataSource.length === 1) {
      cacheRef.current.current = Math.max(cacheRef.current.current - 1, 1)
    }
    fetchDatas(cacheRef.current)
  }

  const reload = () => {
    fetchDatas(cacheRef.current)
  }

  return {
    dataState,
    handleTableChange,
    deleOne,
    cachedParams: cacheRef.current || {},
    reload,
  }
}

/**
 * @typedef {object} ConfigOfUseListPage
 * @property {number} pageSize
 * @property {ParamsShape} baseParams 初始参数，会被筛选条件或者缓存覆盖
 * @property {Object<string,any>} staticParams 静态参数，不会被筛选条件或者缓存覆盖
 */

/**
 * @typedef {object} APIShape
 * @property {(params,cancelToken)=>Promise} getList 想支持请求取消，就接收第二个参数
 * @property {(id)=>Promise} dele
 */

/**
 * @typedef {object} Pagination
 * @property {number} current
 * @property {number} pageSize
 * @property {number} total
 *
 */

/**
 * @typedef {{sort:Object.<string,any>} & Object.<string,any>} ParamsShape
 *
 * @typedef {Pagination & ParamsShape } CacheRefShape
 *
 * @typedef {{page:number,limit:number} & ParamsShape} SendParams
 *
 */
