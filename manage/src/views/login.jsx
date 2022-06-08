import React, { useEffect, useMemo } from 'react'
import { Form, Input, Button, message, Checkbox } from 'antd'
import styled from 'styled-components'
import tokenHolder from '../utils/tokenHolder'
import { useDispatch, useSelector } from 'react-redux'
import { login, setLoginErr } from '../stores/action/admin'
import bg from '../assest/imgs/login.svg'
import intl from 'intl-lightly'
import LocalActions from '../components/localActions'

/**
 * @param {typeof import('../locales/en-gb').default} s
 */
function takeSome(s) {
  return {
    inputTip: s.formTip.input,
    admin_tr: s.admin,
  }
}

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url(${props => props.bg});
  height: 100vh;
  background-size: cover;
  background-position: center;
  align-items: center;
  justify-content: center;
  & > div {
    width: 341px;
    background-color: #ffffffe0;
    padding: 35px 0;
    border-radius: 5px;
    h1 {
      text-align: center;
      margin-bottom: 35px;
    }
  }
`
const MyBtn = styled(Button)`
  width: 100%;
`
const FormItem = styled(Form.Item)`
  & .ant-input-password,
  & #basic_account,
  & #basic_password {
    background-color: transparent;
    background-image: none;
  }
  & .ant-input-password,
  & #basic_account {
    border: 1px solid #1890ff;
  }
`

// 語言icon overlay
const LocaleOverlay = (
  <div
    style={{
      position: 'absolute',
      top: '3%',
      right: '0%',
      fontSize: '50px',
      color: '#ffffffee',
      transform: 'translate(-50%,-50%)',
      MsTransform: 'translate(-50%,-50%)',
    }}
  >
    <LocalActions />
  </div>
)

const afterLogin = p => {
  let redirect = new URLSearchParams(p.location.search).get('redirect')
  if (redirect) {
    const urlParams = new URL(window.location.href)
    const redirectUrlParams = new URL(redirect)
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length)
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1)
      }
    } else {
      window.location.href = '/'
    }
  }
  p.history.replace(redirect || '/')
}

const Login = p => {
  const dispatch = useDispatch()
  const { loading, errMsg } = useSelector(s => s.admin)

  const [labels, rules] = useMemo(() => {
    let keys = ['account', 'password']
    let optional = ['remember_me']
    const { inputTip, admin_tr } = intl.select(takeSome)
    let labels = keys
      .concat(optional) //eslint-disable-next-line
      .reduce((pre, key) => ((pre[key] = admin_tr[key]), pre), {})
    let rules = keys.reduce((pre, key) => {
      pre[key] = [
        {
          required: true,
          message: intl.replace(inputTip, { name: labels[key].toLowerCase() }),
        },
      ]
      return pre
    }, {})
    return [labels, rules]
  }, [])

  useEffect(() => {
    if (loading) return
    let token = tokenHolder.get()
    if (token) {
      afterLogin(p)
    }
    if (errMsg !== null) {
      // 顯示3秒後清除錯誤訊息
      message.error(errMsg, 3, dispatch(setLoginErr(null)))
    }
  }, [loading, p])

  const onFinish = values => {
    if (loading) return
    dispatch(login(values))
  }

  const tailLayout = {
    wrapperCol: {
      offset: 6,
      span: 12,
    },
  }
  return (
    <React.Fragment>
      <CenterBox bg={bg}>
        <div>
          <h1 style={{ fontWeight: 600 }}>{intl.get('admin.login')}</h1>
          <Form
            name="basic"
            onFinish={onFinish}
            labelCol={{ span: 6, offset: 3 }}
            wrapperCol={{ span: 12 }}
          >
            <FormItem
              name="account"
              wrapperCol={{ span: 16, offset: 4 }}
              rules={rules.account}
            >
              <Input autoFocus placeholder={labels.account} />
            </FormItem>

            <FormItem
              name="password"
              wrapperCol={{ span: 16, offset: 4 }}
              rules={rules.password}
            >
              <Input.Password placeholder={labels.password} />
            </FormItem>
            <Form.Item
              wrapperCol={{ offset: 4 }}
              name="remember_me"
              valuePropName="checked"
            >
              <Checkbox>{labels.remember_me}</Checkbox>
            </Form.Item>
            <FormItem {...tailLayout}>
              <MyBtn type="primary" htmlType="submit">
                {intl.get('buttons.submit')}
              </MyBtn>
            </FormItem>
          </Form>
        </div>
      </CenterBox>
      {LocaleOverlay}
    </React.Fragment>
  )
}

export default Login
