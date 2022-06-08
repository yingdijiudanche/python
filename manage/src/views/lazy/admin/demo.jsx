import React, { useMemo } from 'react'
import { Table, Tag } from 'antd'
import api from '../../../api/admin'
import dayjs from 'dayjs'
import { DangerBtn, ModifyBtn } from '../../../components/styled/operateBtns'
import useListPage from '../../../hook/useListPage'
import useSearchColumn from '../../../hook/useSearchColumn'
import intl from 'intl-lightly'
import tw from 'twin.macro'
import styled from 'styled-components'
import BigCard from '../../../components/card/big'
import { Link } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import { accepetColors } from '../../../components/card/colorEnum'
import CustomMenu from '../../../components/menu'
import IconFont from '../../../components/icon/iconFont'
const MenuItem = CustomMenu.Item

const StyledTable = styled(Table)`
  ${tw`font-light`}
  & .ant-table-thead > tr > th {
    ${tw`text-blue-500 font-light bg-white`}
  }
  th::before {
    display: none;
  }
`

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

  // const [_tr.admin, tableLocaled] = useMemo(() => {
  //   return [intl.get('admin'), intl.get('table')];
  // }, []);
  const _tr = useMemo(() => intl.select(takeLocale), [])

  /** @type {import('antd/es/table').ColumnType[]} */
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
  const menus = [
    { title: 'Dashborad', icon: 'icon-yibiaopan' },
    { title: 'Setting', icon: 'icon-tubiao' },
  ]
  return (
    <div>
      <CustomMenu defaultSelectedKey="Dashborad">
        {menus.map(m => (
          <MenuItem
            key={m.title}
            icon={<IconFont type={m.icon} className="text-gray-700" />}
          >
            {m.title}
          </MenuItem>
        ))}
      </CustomMenu>
      <div className="h-10"></div>
      <BigCard
        title="Admin"
        color={accepetColors.blue}
        extraTitle={<HeadAddBtn />}
      >
        <StyledTable
          {...dataState}
          columns={columns}
          rowKey="_id"
          onChange={handleTableChange}
        />
      </BigCard>
    </div>
  )
}
function HeadAddBtn() {
  return (
    <div className="flex items-center">
      <PlusOutlined className="text-xl" />
      <div className="w-1"></div>
      <Link
        to={{ pathname: 'modify' }}
        className="text-xl text-white hover:text-white"
      >
        {intl.get('buttons.add')}
      </Link>
    </div>
  )
}
