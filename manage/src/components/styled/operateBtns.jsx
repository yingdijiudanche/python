import React from 'react'
import { PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import intl from 'intl-lightly'

const StyledLink = styled(Link)`
  padding: 5px 12px;
  color: rgba(0, 0, 0, 0.85);
  &:hover {
    background-color: #6d6d6d0a;
    color: rgba(0, 0, 0, 0.85);
  }
`
/** @type {import('react-router-dom').Link} */
const BlockLink = styled(StyledLink)`
  display: inline-block;
`

const AnchorBtn = styled.a`
  color: rgba(0, 0, 0, 0.85);
  padding: 5px 12px;
  &:hover {
    background-color: #6d6d6d0a;
    color: rgba(0, 0, 0, 0.85);
  }
`

function AddBtn({ state }) {
  return (
    <BlockLink to={{ pathname: 'modify', state }}>
      <Button type="primary" icon={<PlusOutlined />}>
        {intl.get('buttons.add')}
      </Button>
    </BlockLink>
  )
}

/**
 * @param {object} props
 * @param {string} [props.pathname = 'modify'] 跳转目标页面
 * @param {object} props.carry 跳转页面时携带的数据
 */
function ModifyBtn({ pathname = 'modify', carry, style }) {
  return (
    <StyledLink to={{ pathname, state: carry }} style={style}>
      <EditFilled />
    </StyledLink>
  )
}

/**
 * @param {object} props
 * @param {()=>void} props.onConfirm 弹窗确认回调函数
 */
function DangerBtn({ onConfirm, title = intl.get('deleConfirm.title') }) {
  return (
    <Popconfirm
      title={title}
      okText={intl.get('deleConfirm.yes')}
      cancelText={intl.get('deleConfirm.cancel')}
      onConfirm={onConfirm}
    >
      <AnchorBtn>
        <DeleteFilled />
      </AnchorBtn>
    </Popconfirm>
  )
}
export { AddBtn, ModifyBtn, DangerBtn, AnchorBtn, StyledLink }
