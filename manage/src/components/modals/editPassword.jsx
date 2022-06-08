import React, { useMemo } from 'react'
import { message, Form, Input, Button, Modal } from 'antd'
import api from '../../api/admin'
import tokenHolder from '../../utils/tokenHolder'
import { useHistory } from 'react-router-dom'
import intl from 'intl-lightly'

const Item = Form.Item
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}
const tailLayout = {
  wrapperCol: { span: 8, offset: 8 },
}

const confirmPwdValidator =
  msg =>
  ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve()
      }
      return Promise.reject(msg)
    },
  })
// const rules = {
//     oldPassword: [{ required: true, message: "请输入旧密码" }],
//     password: [{ required: true, message: "请输入密码" }],
//     confirm: [{ required: true, message: "请再次输入密码" }, confirmPwdValidator],

// }
/**
 *
 * @param {typeof import('../../locales/en-gb').default} s
 */
const takeSome = function (s) {
  return {
    admin_tr: s.admin,
    formTip: s.formTip,
    userActions_tr: s.userActions,
  }
}

export default function EditPassword({ visible, toggle, info: { id } }) {
  const [form] = Form.useForm()
  const history = useHistory()

  const [labels, rules, userActions] = useMemo(() => {
    const { admin_tr, formTip, userActions_tr } = intl.select(takeSome)

    let keys = ['password', 'oldPwd', 'newPwd', 'confirm']

    let rules = keys.reduce((pre, key) => {
      let message = intl.replace(formTip.input, {
        name: admin_tr[key].toLowerCase(),
      })
      pre[key] = [{ required: true, message }]
      return pre
    }, {})
    const confirmVlidator = confirmPwdValidator(
      intl.replace(formTip.confirmFail, {
        name: admin_tr.password.toLowerCase(),
      })
    )
    rules.confirm.push(confirmVlidator)
    return [admin_tr, rules, userActions_tr]
  }, [])

  const onFinish = async values => {
    console.log(values)
    let res = await api.editPassword(id, values)
    if (res.code) return message.error(res.msg)
    // 1秒後跳轉登入頁面
    message.success(res.msg, 1, () => {
      tokenHolder.remove()
      history.replace('/login')
    })
    toggle()
  }

  return (
    <Modal
      title={userActions.editPwd}
      visible
      closable
      onCancel={toggle}
      footer={null}
    >
      <Form {...layout} form={form} onFinish={onFinish}>
        <Item
          label={labels.oldPwd}
          name="oldPassword"
          rules={rules.oldPwd}
          hasFeedback
        >
          <Input.Password />
        </Item>
        <Item
          label={labels.newPwd}
          name="password"
          rules={rules.newPwd}
          hasFeedback
        >
          <Input.Password />
        </Item>
        <Form.Item
          name="confirm"
          label={labels.confirm}
          dependencies={['password']}
          hasFeedback
          rules={rules.confirm}
        >
          <Input.Password />
        </Form.Item>
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {intl.get('buttons.submit')}
          </Button>
        </Item>
      </Form>
    </Modal>
  )
}
