import React from 'react'
import { Modal, Tag } from 'antd'
import styled from 'styled-components'
import dayjs from 'dayjs'
import intl from 'intl-lightly'

/**
 * @param {typeof import('../../locales/en-gb').default} s
 * @returns
 */
function takeSome(s) {
  return {
    title_tr: s.userActions.profile,
    localed: s.admin,
    addTime_tr: s.table.addTime,
  }
}
const Row = styled.div`
  display: flex;
  height: 30px;
  & > div:first-of-type {
    color: #7d7d7d;
  }
`
export default function Profile({
  info: { roleName, name, account, email, addTime },
  toggle,
}) {
  let { title_tr, localed, addTime_tr } = intl.select(takeSome)
  return (
    <Modal
      title={title_tr}
      visible={true}
      closable
      onCancel={toggle}
      footer={null}
    >
      <Row>
        <div>{localed.role}：</div>
        <div>
          <Tag>{roleName}</Tag>
        </div>
      </Row>
      <Row>
        <div>{localed.account}：</div>
        <div>{account}</div>
      </Row>
      <Row>
        <div>{localed.name}：</div>
        <div>{name}</div>
      </Row>
      {/* <Row>
        <div>{localed.email}：</div>
        <div>{email}</div>
      </Row> */}
      <Row>
        <div>{addTime_tr}：</div>
        <div>{dayjs(addTime).format('DD/MM/YYYY')}</div>
      </Row>
    </Modal>
  )
}
