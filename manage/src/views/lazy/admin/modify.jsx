import React, { useEffect, useMemo, useState } from 'react'
import { message, Form, Input, Button, Select, Switch } from 'antd'
import api from '../../../api/admin'
import roleApi from '../../../api/role'
import intl from 'intl-lightly'

/**
 * @param {typeof import('../../../locales/en-gb').default} s
 */
function takeSome(s) {
  return {
    formTip: s.formTip,
    admin_tr: s.admin,
  }
}
const Item = Form.Item
const Option = Select.Option

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
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

export default function Admin({ location, history }) {
  const { editData } = location.state || {}
  const isEdit = editData !== undefined
  const [form] = Form.useForm()
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const initRoles = async () => {
      let res = await roleApi.getAll()
      if (res.code) return message.error(res.msg)
      setRoles(res.data)
    }
    initRoles()
    if (isEdit) {
      form.setFieldsValue(editData)
    }
    //eslint-disable-next-line
  }, [])

  const [localedLabel, rules] = useMemo(() => {
    const { admin_tr, formTip } = intl.select(takeSome)
    let keys = ['account', 'name', 'email', 'password', 'confirm']
    let rules = keys.reduce((pre, key) => {
      let message = intl.replace(formTip.input, {
        name: admin_tr[key].toLowerCase(),
      })
      pre[key] = [{ required: true, message }]
      return pre
    }, {})

    // rules.account.push(accountValidator);
    let roleMsg = intl.replace(formTip.select, { name: admin_tr.role })
    rules.role = [{ required: true, message: roleMsg }]
    const confirmVlidator = confirmPwdValidator(
      intl.replace(formTip.confirmFail, {
        name: admin_tr.password.toLowerCase(),
      })
    )
    rules.confirm.push(confirmVlidator)
    return [admin_tr, rules]
  }, [])

  const onSubmit = async () => {
    let hasErr = false
    let values = await form.validateFields().catch(e => (hasErr = true))
    if (hasErr) return
    let res = isEdit
      ? await api.edit(editData._id, values)
      : await api.add(values)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    history.goBack()
  }

  return (
    <Form {...layout} form={form} name="admin">
      <Item label={localedLabel.role} name="roleId">
        <Select placeholder={intl.get('placeholder.selector')}>
          {roles.map(v => (
            <Option value={v._id} key={v._id}>
              {v.name}
            </Option>
          ))}
        </Select>
      </Item>
      <Item label={localedLabel.account} name="account" rules={rules.account}>
        <Input />
      </Item>
      <Item label={localedLabel.name} name="name" rules={rules.name}>
        <Input />
      </Item>

      {isEdit ? null : (
        <>
          <Item
            label={localedLabel.password}
            name="password"
            rules={rules.password}
            hasFeedback
          >
            <Input.Password />
          </Item>
          <Form.Item
            name="confirm"
            label={localedLabel.confirm}
            dependencies={['password']}
            hasFeedback
            rules={rules.confirm}
          >
            <Input.Password />
          </Form.Item>
        </>
      )}

      <Item {...tailLayout}>
        <Button type="primary" onClick={onSubmit}>
          {intl.get('buttons.submit')}
        </Button>
      </Item>
    </Form>
  )
}
