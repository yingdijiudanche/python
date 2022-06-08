import React, { useMemo } from 'react'
import { Table, Tag } from 'antd'
import api from '../../../api/admin'
import dayjs from 'dayjs'
import {
  AddBtn,
  DangerBtn,
  ModifyBtn,
} from '../../../components/styled/operateBtns'
import useListPage from '../../../hook/useListPage'
import useSearchColumn from '../../../hook/useSearchColumn'
import intl from 'intl-lightly'

/**  @param {typeof import('../../../locales/en-gb').default} s */
const takeLocale = s => {
  return {
    admin: s.admin,
    table: s.table,
  }
}
// let {a,b} = takeLocale({})

export default function Admins() {
  const { dataState, handleTableChange, deleOne } = useListPage(api)

  const _tr = useMemo(() => intl.select(takeLocale), [])

  /** @type {import('antd/lib/table').ColumnsType} */
  const columns = [
    {
      title: _tr.table.operation,
      dataIndex: 'sort',
      key: 'operation',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            <ModifyBtn carry={{ editData: data }} />
            <DangerBtn onConfirm={deleOne(data._id)} />
          </div>
        )
      },
    },
    { title: _tr.admin.account, dataIndex: 'account', key: 'account' },
    {
      title: _tr.admin.name,
      dataIndex: 'name',
      key: '~name',
      ...useSearchColumn(_tr.admin.name),
    },

    {
      title: _tr.admin.role,
      dataIndex: 'roleName',
      key: 'roleName',
      render: v => <Tag>{v}</Tag>,
    },

    {
      title: _tr.table.addTime,
      dataIndex: 'addTime',
      key: 'addTime',
      render: t => dayjs(t).format('DD/MM/YYYY'),
    },
  ]
  return (
    <div>
      <AddBtn />

      <Table
        {...dataState}
        columns={columns}
        rowKey="_id"
        onChange={handleTableChange}
        bordered={true}
      />
    </div>
  )
}
