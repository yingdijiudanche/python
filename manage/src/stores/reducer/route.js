import initialState from '../state/route'
import { INIT_ROUTES, SEARCH_ROUTES, TRANSLATE_ROUTES } from '../actionTypes'
import intl from 'intl-lightly'

const translateFn = () => {
  const routes_tr = intl.get('routes')

  const tranlater = v => {
    v.name = /modify$/.test(v.path) ? v.name : routes_tr[v.path] || v.name

    if (v.children) {
      v.children.forEach(tranlater)
    }
  }

  return tranlater
}

function extraData(v) {
  if (!v.children.length) {
    return { ...v, children: null }
  }
  return v
}

function deepSearchByKey(key, keyword, dataSource) {
  let reg = new RegExp(keyword, 'i')
  let matched = dataSource.map(v => {
    let one = { ...v }
    let isFit = reg.test(one[key])
    let children = []
    if (one.children) {
      children = one.children.filter(c => reg.test(c[key]))
    }
    if (isFit || children.length) {
      one.children = children.length ? children : null
      return one
    }
  })
  return matched.filter(v => v !== undefined)
}

function groupByKey(key, arr) {
  let grouped = new Map()
  for (let i = 0; i < arr.length; i++) {
    let v = arr[i]
    let k = v[key]
    let g = grouped.get(k)
    if (g) {
      g.children = [...g.children, ...v.children]
      grouped.set(k, g)
    } else {
      grouped.set(k, v)
    }
  }
  return Array.from(grouped.values())
}
function calcTableDatas(state, payload) {
  let kvs = Object.entries(payload).filter(kv => !!kv[1])
  if (!kvs.length) {
    return {
      ...state,
      searchParams: payload,
      tableExpandable: null,
      tableDatas: state.rawDatas.map(extraData),
    }
  }

  let matched = kvs
    .map(([k, v]) => {
      //注意: 现在只有name 和path,如果新增其他属性,需要额外处理
      return deepSearchByKey(k, v, state.rawDatas)
    })
    .flat()
  const groupedById = groupByKey('_id', matched)

  const tableExpandable = matched.length
    ? { expandedRowKeys: matched.map(v => v._id) }
    : undefined
  return {
    ...state,
    tableDatas: groupedById.map(extraData),
    searchParams: payload,
    tableExpandable,
  }
}
function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case INIT_ROUTES:
      payload.forEach(p => {
        p.children.forEach(c => (c.pid = p._id))
      })
      payload.forEach(translateFn())
      state.rawDatas = payload
      return calcTableDatas(state, state.searchParams)

    case TRANSLATE_ROUTES:
      if (!state.rawDatas.length) return state
      state.rawDatas.forEach(translateFn())
      return { ...state }

    case SEARCH_ROUTES:
      return calcTableDatas(state, payload)

    default:
      return state
  }
}
export default reducer
