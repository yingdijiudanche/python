import React, { useMemo } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import tokenHolder from '../../utils/tokenHolder'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateRoutes } from '../../stores/action/route'
import intl from 'intl-lightly'

export default function Logout({ toggle }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const handleLogout = () => {
    tokenHolder.remove()
    dispatch(updateRoutes([]))
    history.replace('/login')
  }
  const confirmLocal = useMemo(() => intl.get('userActions.confirm'), [])
  return (
    <Modal
      title={
        <div>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          {confirmLocal.title}
        </div>
      }
      visible
      onOk={handleLogout}
      onCancel={toggle}
      okText={confirmLocal.ok}
      cancelText={confirmLocal.cancel}
    >
      <p>{confirmLocal.content}</p>
    </Modal>
  )
}
