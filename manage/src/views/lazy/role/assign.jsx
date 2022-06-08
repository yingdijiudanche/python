import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Checkbox, Button, message } from 'antd'
import styled from 'styled-components'
import api from '../../../api/role'

const CheckboxGroup = styled(Checkbox.Group)`
  padding-left: 23px;
  & > label {
    margin-right: 20px;
    margin-top: 5px;
  }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  min-height: inherit;
`
const Expand = styled.div`
  flex: 1;
  & > div + div {
    margin-top: 15px;
  }
`
const Center = styled.div`
  display: flex;
  justify-content: center;
`
const extra = function (m, childrenIds) {
  let checkList = []
  m.children.forEach(c => {
    if (!childrenIds.includes(c._id)) return
    checkList.push(c.name)
  })
  let curLen = checkList.length,
    allLen = m.children.length,
    indeterminate = curLen < allLen,
    checkedAll = curLen === allLen,
    cur = { checkedAll, checkList, indeterminate }
  return cur
}
/**
 *
 * @param {OwnRoutes} ids
 * @param {Route[]} routes
 */
const extraDefalutValue = (ids = [], routes = []) => {
  let checked = new Map()
  ids.forEach(r => {
    let fit = routes.find(v => v._id === r.routeId)
    let checkState = extra(fit, r.childrenIds)
    checked.set(r.routeId, checkState)
  })
  return checked
}
export default function Assign({ location, history }) {
  const role = location.state.data
  const routes = useSelector(s => s.route.rawDatas)

  //以id为key check状态为value {id:{checkedAll:false,checkList:[]}}
  const defaulState = useMemo(
    () => extraDefalutValue(role.ownRoutes, routes),
    [role.ownRoutes, routes]
  )
  const [checkStateMap, setCheckState] = useState(defaulState)

  const allCheck =
    route =>
    ({ target: { checked } }) => {
      let cur = checked
        ? {
            checkedAll: true,
            checkList: route.children.map(c => c.name),
            indeterminate: false,
          }
        : { checkedAll: false, checkList: [], indeterminate: false }

      if (checked) {
        checkStateMap.set(route._id, cur)
      } else {
        checkStateMap.delete(route._id)
      }

      setCheckState(new Map(checkStateMap))
    }

  const singleCheck = route => values => {
    let checkList = values,
      curLen = checkList.length,
      allLen = route.children.length,
      indeterminate = curLen < allLen,
      checkedAll = curLen === allLen,
      cur = { checkedAll, checkList, indeterminate }
    if (!curLen && indeterminate) {
      checkStateMap.delete(route._id)
    } else {
      checkStateMap.set(route._id, cur)
    }

    setCheckState(new Map(checkStateMap))
  }

  const buildCheckbox = route => {
    let {
      checkedAll = false,
      checkList = [],
      indeterminate = false,
    } = checkStateMap.get(route._id) || {}

    if (!route.children.length) {
      return (
        <div key={route._id}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={allCheck(route)}
            checked={checkedAll}
          >
            {route.name}
          </Checkbox>
        </div>
      )
    }

    return (
      <div key={route._id}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={allCheck(route)}
          checked={checkedAll}
        >
          {route.name}
        </Checkbox>
        <div></div>
        <CheckboxGroup
          options={route.children.map(c => c.name)}
          value={checkList}
          onChange={singleCheck(route)}
        ></CheckboxGroup>
      </div>
    )
  }

  const submit = async () => {
    let ownRoutes = []
    checkStateMap.forEach(({ checkList }, id) => {
      // if (!checkList.length) return;
      let one = { routeId: id }

      let children = routes.find(m => m._id === id).children
      one.childrenIds = checkList.map(v => children.find(c => c.name === v)._id)

      return ownRoutes.push(one)
    })
    let params = { roleId: role._id, ownRoutes }
    let res = await api.assignRoutes(params)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    history.replace('index')
  }

  return (
    <Column>
      <Expand>{routes.map(buildCheckbox)}</Expand>
      <Center>
        <Button type="primary" onClick={submit}>
          确认提交
        </Button>
      </Center>
    </Column>
  )
}

/**
 * @typedef {Object} OwnRoute
 * @property {string[]} childrenIds
 * @property {string} routeId
 * @typedef {OwnRoute[]} OwnRoutes
 */
/**
 * @typedef {object} Route
 * @property {string} _id
 * @property {Route[]} children
 */
