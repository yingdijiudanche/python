import React, { useMemo } from 'react'
import { message, Table } from 'antd'
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import api from '../../../api/route'
import { getRoutes, searchRoutes } from '../../../stores/action/route'

import {
  ModifyBtn,
  DangerBtn,
  AddBtn,
} from '../../../components/styled/operateBtns'
import intl from 'intl-lightly'
import useSearchColumn from '../../../hook/useSearchColumn'
import IconFont from '../../../components/icon/iconFont'

/**
 * @param {typeof import('../../../locales/en-gb').default} s
 */
function takeSome(s) {
  return {
    route: s.route,
    table: s.table,
  }
}
const MyIcon = styled(StopOutlined)`
  font-size: 18px;
`
const IconShow = styled(CheckCircleOutlined)`
  color: green;
`

function Routes() {
  const [tableDatas, expandable, adminInfo] = useSelector(s => [
    s.route.tableDatas,
    s.route.tableExpandable,
    s.admin.info,
  ])
  const dispatch = useDispatch()
  const _tr = useMemo(() => intl.select(takeSome))

  const deleOne = (id, pid) => async () => {
    let res = await api.dele(id, pid)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    dispatch(getRoutes(adminInfo.roleId))
  }

  const columns = [
    {
      title: _tr.table.operation,
      dataIndex: 'sort',
      width: 150,
      key: 'operation',
      render: (_, data) => {
        if (!data.pid && data.children?.length) {
          return <ModifyBtn carry={{ editData: data }} />
        }
        return (
          <div style={{ display: 'flex' }}>
            <ModifyBtn carry={{ editData: data }} />
            <DangerBtn onConfirm={deleOne(data._id, data.pid)} />
          </div>
        )
      },
    },
    {
      title: _tr.route.icon,
      dataIndex: 'icon',
      key: 'icon',
      render: d => (d ? <IconFont type={d} style={{ fontSize: 25 }} /> : null),
    },
    {
      title: _tr.route.name,
      dataIndex: 'name',
      key: 'name',
      ...useSearchColumn(_tr.route.name),
    },
    {
      title: _tr.route.path,
      align: 'center',
      dataIndex: 'path',
      key: 'path',
      ...useSearchColumn(_tr.route.path),
    },
    {
      title: _tr.route.isMenu,
      align: 'center',
      dataIndex: 'isMenu',
      key: 'isMenu',
      render: text => (text ? <MyIcon as={IconShow} /> : <MyIcon />),
    },
    { title: _tr.route.sort, align: 'center', dataIndex: 'sort', key: 'num' },
  ]

  const handleTableChange = (pagination, filters, sorts) => {
    dispatch(searchRoutes(filters))
  }

  return (
    <div>
      <AddBtn />
      <Table
        dataSource={tableDatas}
        expandable={expandable}
        onChange={handleTableChange}
        columns={columns}
        rowKey="_id"
      />
    </div>
  )
}

export default Routes
