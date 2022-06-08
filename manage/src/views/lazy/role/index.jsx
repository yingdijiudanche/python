import React, { useEffect, useMemo, useState } from 'react'
import { message, Table } from 'antd'
import api from '../../../api/role'
import {
  AddBtn,
  DangerBtn,
  ModifyBtn,
  StyledLink,
} from '../../../components/styled/operateBtns'
import { PartitionOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import intl from 'intl-lightly'
import useAutoCancel from '../../../hook/useAutoCancel'

/**
 * @param {typeof import('../../../locales/en-gb').default} s
 */
function takeSome(s) {
  return {
    role: s.role,
    table: s.table,
  }
}
export default function Roles() {
  const [roles, setRoles] = useState([])
  const localed = useMemo(() => intl.select(takeSome), [])

  const deleOne = id => async () => {
    let res = await api.dele(id)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    getData()
  }
  const getData = useAutoCancel(async (cancelToken, isCanceld) => {
    let res = await api.getAll(cancelToken)
    if (res.code) {
      if (isCanceld(res.msg)) return
      message.error(res.msg)
      return
    }

    setRoles(res.data)
  })

  useEffect(() => {
    getData()
  }, [])

  /** @type {import('antd/lib/table').ColumnsType} */
  const columns = [
    {
      title: localed.table.operation,
      dataIndex: 'sort',
      key: 'operation',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            <ModifyBtn carry={{ editData: data }} />
            <StyledLink to={{ pathname: 'assign', state: { data } }}>
              <PartitionOutlined />
            </StyledLink>
            <DangerBtn onConfirm={deleOne(data._id)} />
          </div>
        )
      },
    },
    { title: localed.role.name, dataIndex: 'name', key: 'name' },
    {
      title: localed.role.ownRoutes,
      align: 'center',
      dataIndex: 'ownRoutes',
      key: 'ownRoutes',
      render: v => (v.length ? v.length : localed.role.all),
    },
    {
      title: localed.table.addTime,
      align: 'center',
      dataIndex: 'addTime',
      key: 'addTime',
      render: t => dayjs(t).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  return (
    <div>
      <AddBtn />
      <Table dataSource={roles} columns={columns} rowKey="_id" />
    </div>
  )
}
