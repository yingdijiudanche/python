import React, { useMemo, useState } from 'react'
import { Menu, Dropdown } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import Profile from './modals/profile'
import EditPassword from './modals/editPassword'
import Logout from './modals/logout'
import intl from 'intl-lightly'

const Item = Menu.Item
const UserIcon = styled(UserOutlined)`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  margin-right: 10px;
  cursor: pointer;
`

export default function Actions({ info }) {
  const [showProfile, setShowProfile] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const toggleProfile = () => setShowProfile(s => !s)
  const toggleEdit = () => setShowEdit(s => !s)
  const toggleLogout = () => setShowLogout(s => !s)
  const localed = useMemo(() => intl.get('userActions'), [])
  // console.log('userAcitons render')
  return (
    <div>
      <Dropdown
        overlay={
          <Menu>
            <Item key="1" onClick={toggleProfile}>
              {localed.profile}
            </Item>
            <Item key="2" onClick={toggleEdit}>
              {localed.editPwd}
            </Item>
            <Item key="3" onClick={toggleLogout}>
              {localed.logout}
            </Item>
          </Menu>
        }
        placement="bottomLeft"
      >
        <UserIcon />
      </Dropdown>
      {showProfile && <Profile toggle={toggleProfile} info={info} />}
      {showEdit && <EditPassword toggle={toggleEdit} info={info} />}
      {showLogout && <Logout toggle={toggleLogout} />}
    </div>
  )
}
