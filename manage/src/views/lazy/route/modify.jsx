import React, { useEffect, useMemo, useState } from 'react'
import {
  message,
  Form,
  Input,
  Switch,
  InputNumber,
  Button,
  Select,
  Modal,
} from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { getRoutes } from '../../../stores/action/route'
import SufixTip from '../../../components/styled/sufixTip'
import api from '../../../api/route'
import intl from 'intl-lightly'
import { PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import IconPan from '../../../components/icon/iconPan'
import IconFont from '../../../components/icon/iconFont'

const Item = Form.Item
const Option = Select.Option

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}
const tailLayout = {
  wrapperCol: { span: 8, offset: 4 },
}
const initialValues = { isMenu: false }

const AddIconBtn = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  & > .anticon-plus {
    color: rgb(173 172 172);
  }
  font-size: 28px;
`
// const rules = {
//     name: [{ required: true, message: "请输入路由名称" }],
//     path: [{ required: true, message: "请输入访问路径" }],
//     sort: [{ required: true, message: "请输入序号" }]

// }
/**
 * @param {typeof import('../../../locales/en-gb').default} s
 */
function takeSome(s) {
  return {
    _tr: s.route,
    formTip: s.formTip,
  }
}
export default function Routes({ location, history }) {
  const { editData } = location.state || {}
  const isEdit = editData !== undefined
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [iconModalShow, setIconModalShow] = useState(false)

  const [rawDatas, parents, adminInfo] = useSelector(s => [
    s.route.rawDatas,
    s.route.rawDatas.filter(v => v.component === ''),
    s.admin.info,
  ])

  useEffect(() => {
    if (isEdit) {
      let values = { ...editData }
      delete values.children
      form.setFieldsValue(values)
    } else {
      form.setFieldsValue({ sort: parents.length + 1 })
    }
  }, [])

  const handleValuesChange = (ed, all) => {
    if (ed.path && all.pid) return onPathChange(ed.path)
    if (ed.pid) return onPidChange(ed.pid)
  }

  const onPathChange = value => {
    value = value[0] === '/' ? value.substring(1) : value
    form.setFieldsValue({ component: value })
  }

  const onPidChange = value => {
    let target = parents.find(v => v._id === value)
    let sort = Array.isArray(target.children) ? target.children.length + 1 : 1
    let isBecomeChild = false,
      previosParentId
    if (isEdit) {
      isBecomeChild = rawDatas.some(v => v._id == editData._id)
      if (!isBecomeChild) {
        //当前是子菜单
        let preParent = parents.find(v =>
          v.children.some(c => c._id == editData._id)
        )
        if (preParent) {
          previosParentId = preParent._id
        }
      }
    }
    form.setFieldsValue({ sort, previosParentId, isBecomeChild })
  }

  const onSubmit = async () => {
    let hasErr = false
    let values = await form.validateFields().catch(e => (hasErr = true))
    if (hasErr) return
    const { pid } = values
    delete values.pid
    let res = isEdit
      ? await api.edit(editData._id, values, pid)
      : await api.add(values, pid)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    dispatch(getRoutes(adminInfo.roleId))
    history.goBack()
  }

  const handleIconPanClick = icon => {
    console.log(icon)
    form.setFieldsValue({ icon })
    setIconModalShow(false)
  }

  const [labels, rules] = useMemo(() => {
    const { _tr, formTip } = intl.select(takeSome)
    let keys = ['name', 'path']
    const rules = keys.reduce((pre, key) => {
      let message = intl.replace(formTip.input, {
        name: _tr[key].toLowerCase(),
      })
      pre[key] = [{ required: true, message }]
      return pre
    }, {})
    return [_tr, rules]
  }, [])

  const currentIcon = form.getFieldValue('icon')
  return (
    <>
      <Form
        {...layout}
        form={form}
        name="route"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        <Item name="icon" label={labels.icon}>
          <div>
            <AddIconBtn onClick={() => setIconModalShow(true)}>
              {currentIcon ? <IconFont type={currentIcon} /> : <PlusOutlined />}
            </AddIconBtn>
            <Input hidden />
          </div>
        </Item>
        <Item label={labels.pid} name="pid">
          <Select placeholder={intl.get('placeholder.routeParent')}>
            {parents.map(v => (
              <Option value={v._id} key={v._id}>
                {v.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item hidden name="previosParentId">
          <Input />
        </Item>
        <Item hidden name="isBecomeChild">
          <Input />
        </Item>
        <Item label={labels.name} name="name" rules={rules.name}>
          <Input />
        </Item>
        <Item label={labels.path} name="path" rules={rules.path}>
          <Input />
        </Item>
        <Item label={labels.component} name="component">
          <Input addonBefore={<span>/ lazy /</span>} />
        </Item>
        <Item label={labels.sort}>
          <Item name="sort" noStyle>
            <InputNumber min={1} />
          </Item>
          <SufixTip>{intl.get('tips.autoGen')}</SufixTip>
        </Item>
        <Item label={labels.isMenu} name="isMenu" valuePropName="checked">
          <Switch />
        </Item>
        <Item {...tailLayout}>
          <Button type="primary" onClick={onSubmit}>
            {intl.get('buttons.submit')}
          </Button>
        </Item>
      </Form>
      <Modal
        visible={iconModalShow}
        footer={null}
        onCancel={() => setIconModalShow(false)}
        closable
      >
        <IconPan onClickOne={handleIconPanClick} selected={currentIcon} />
      </Modal>
    </>
  )
}
