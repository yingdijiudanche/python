import React, { useEffect, useMemo } from 'react'
import { message, Form, Input, Button } from 'antd'
import api from '../../../api/role'
import intl from 'intl-lightly'

const Item = Form.Item
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
}
const initialValues = { isMenu: false }

export default function RoleModify({ location, history }) {
  const editData = location.state?.editData
  const isEdit = editData !== undefined
  const [form] = Form.useForm()

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(editData)
    }
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
    history.replace('index')
  }

  const [labels, rules] = useMemo(() => {
    let labels = intl.get('role')
    let rules = [
      {
        required: true,
        message: intl.getReplaced('formTip.input', { name: labels.name }),
      },
    ]
    return [labels, rules]
  }, [])

  return (
    <Form {...layout} form={form} name="role" initialValues={initialValues}>
      <Item label={labels.name} name="name" rules={rules.name}>
        <Input />
      </Item>

      <Item {...tailLayout}>
        <Button type="primary" onClick={onSubmit}>
          {intl.get('buttons.submit')}
        </Button>
      </Item>
    </Form>
  )
}
