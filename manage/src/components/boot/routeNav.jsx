import React, { useMemo } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import intl from 'intl-lightly'
import IconFont from '../icon/iconFont'
// import tw from 'twin.macro';
// import styled from 'styled-components';
// const StyledMenu = styled(Menu)`
//   ${tw`px-3`}
//   .ant-menu-sub.ant-menu-inline{
//     background: none;
//   }
//   li {
//     ${tw`rounded-lg`}
//   }
//   a {
//     ${tw`text-white`}
//   }
//   .ant-menu-item-selected {
//     ${tw`bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md`}
//   }
// `;
const { SubMenu, Item } = Menu

// const scrollSty = { maxHeight: '100vh', overflowY: 'auto' }

const hasChild = v => !v.pid && !v.component

const buildIcon = v => (v.icon ? <IconFont type={v.icon} /> : null)

const buildItem = v => (
  <Item key={v.path} icon={buildIcon(v)}>
    <Link to={v.path} style={{ color: 'inherit' }}>
      {intl.get('routes.' + v.path) || v.name}
    </Link>
  </Item>
)

const buildSubItem = v => (
  <SubMenu
    key={v.path}
    title={intl.get('routes.' + v.path) || v.name}
    icon={buildIcon(v)}
  >
    {v.children.map(buildItem)}
  </SubMenu>
)

const buildAll = v => (hasChild(v) ? buildSubItem(v) : buildItem(v))

const MenuNav = ({ routes = [], currLocation = '' }) => {
  const navItems = useMemo(() => routes.map(buildAll), [routes])
  /**
   * @see {@link https://ant.design/components/route-cn/}
   */
  return (
    <Menu mode="inline" selectedKeys={[currLocation]} theme="dark">
      {navItems}
    </Menu>
  )
}

export default MenuNav
