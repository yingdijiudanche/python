import React, { useContext } from 'react'
import { Menu, Dropdown } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { localeContext, langsOptions } from '../config/localeContext'

const Item = Menu.Item
const GlobalIcon = styled(GlobalOutlined)`
  font-size: 18px;
  line-height: 64px;
  padding: 0 12px;
  margin-right: 10px;
  cursor: pointer;
`

export default function LocalActions() {
  const { curLocale, setCurLocale } = useContext(localeContext)

  return (
    <div>
      <Dropdown
        overlay={
          <Menu defaultSelectedKeys={curLocale}>
            {langsOptions.map(v => (
              <Item
                key={v.value}
                lang={v.value}
                onClick={() => setCurLocale(v.value)}
              >
                {v.label}
              </Item>
            ))}
          </Menu>
        }
        placement="bottomLeft"
      >
        <GlobalIcon />
      </Dropdown>
    </div>
  )
}
