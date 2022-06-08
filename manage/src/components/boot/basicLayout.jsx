import React, { useState, useEffect, useMemo } from 'react'
import { Layout, Breadcrumb, message } from 'antd'
import styled from 'styled-components'
import {
  Route,
  Redirect,
  Switch,
  useHistory,
  Link,
  useLocation,
} from 'react-router-dom'
import MenuNav from './routeNav'
import { useSelector, useDispatch } from 'react-redux'
import { initByToken, setLoginErr } from '../../stores/action/admin'
import { getRoutes } from '../../stores/action/route'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import UserActions from '../userActions'
import calcLinks, { updateCrumb } from '../../utils/breadcrumb'
import LocalActions from '../localActions'
import lazyPagesKeyValue from '../../views/lazy'
import NotMatch from '../../views/404'

const { Header, Sider, Content } = Layout
// const { Header, Footer, Sider, Content } = Layout;
const Unfold = styled(MenuUnfoldOutlined)`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`
const Fold = Unfold.withComponent(MenuFoldOutlined)
const SpaceBetweenHeader = styled(Header)`
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > .right {
    display: flex;
  }
`
//TODO change to project icon
const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`
const BigText = styled.div`
  color: rgba(255, 255, 255, 0.65);
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  height: 38px;
  line-height: 38px;
  margin: 0;
  margin-top: 30px;
  overflow: hidden;
`
const centerSty = { flexGrow: 1, textAlign: 'center' }
// const centerText = { textAlign: 'center' }

const isShow = m => m.isMenu
const buildFirst = v => <Redirect key="redirect-1" exact from="/" to={v.path} />

const extraNavs = routes => {
  const coverChildren = m => m.children.filter(isShow)
  const ignoreHidden = m => ({
    ...m,
    children: coverChildren(m),
  })
  return routes.filter(isShow).map(ignoreHidden).sort()
}

const extraValid = routes => {
  const hasComponent = v => v.children.length > 0
  const isComponent = v => v.component !== ''
  const validRoutes = routes
    .filter(hasComponent)
    .map(v => v.children)
    .flat()
  return [...routes.filter(isComponent), ...validRoutes]
}

const buildRoute = v => (
  <Route
    key={v._id}
    path={v.path}
    // component={React.lazy(lazyPagesKeyValue[v.component])} />
    component={lazyPagesKeyValue[v.component]}
  />
)

const extraRoutes = validRoutes => {
  const home = validRoutes.find(
    v => !/modify/.test(v.path) && v.component !== ''
  )
  const homeRoute = <Redirect key="home" exact from="/" to={home.path} />
  const routes = validRoutes.map(buildRoute)
  routes.push(homeRoute)
  return routes
}

const initLinks = (location, first, validRoutes) => {
  const { pathname } = location
  if (pathname === first.path) {
    return [first]
  }
  const reg = /\/modify$/
  let showingLinks = []
  if (reg.test(pathname)) {
    //如果第一个页面是modify，尝试查找它的上一页 index，以便还原完整的面包屑
    let prefix = pathname.replace(reg, '')
    let pattner = new RegExp(prefix + '/index')
    let before = validRoutes.find(v => pattner.test(v.path))
    if (before) {
      showingLinks.push(before)
    }
  }
  showingLinks.push(validRoutes.find(v => v.path === pathname) || first)

  return showingLinks
}

const extraBreadcrumb = v => {
  return (
    <Breadcrumb.Item key={v._id}>
      <Link to={v.path}>{v.name}</Link>
    </Breadcrumb.Item>
  )
}

const BacisLayout = () => {
  const history = useHistory()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [validRoutes, setvalidRoutes] = useState([])
  const [links, setLinks] = useState([])
  const dispatch = useDispatch()
  const [adminInfo, errMsg] = useSelector(s => [s.admin.info, s.admin.errMsg])
  const routeDatas = useSelector(s => s.route.rawDatas)

  useEffect(() => {
    if (!errMsg) return
    message.error(errMsg)
    dispatch(setLoginErr(null))
    //eslint-disable-next-line
  }, [errMsg])

  useEffect(() => {
    if (adminInfo._id === 0) {
      dispatch(initByToken())
      return
    }

    if (routeDatas.length === 0) {
      dispatch(getRoutes(adminInfo.roleId))
      return
    }

    //eslint-disable-next-line
  }, [routeDatas, adminInfo._id])

  useEffect(() => {
    if (!validRoutes.length) return

    const updateLinks = location => {
      let n = calcLinks(location, validRoutes, links)
      setLinks(n)
    }
    const unListen = history.listen(updateLinks)
    setLinks(updateCrumb(links, location))
    return unListen
    //eslint-disable-next-line
  }, [validRoutes])

  const ToggleMemo = useMemo(() => {
    return React.createElement(collapsed ? Unfold : Fold, {
      onClick: () => setCollapsed(!collapsed),
    })
  }, [collapsed])

  const UserActionsMemo = useMemo(
    () => <UserActions info={adminInfo} />,
    [adminInfo]
  )
  const LocalActionMemo = useMemo(() => <LocalActions />, [])
  const [navs, MainMemo] = useMemo(() => {
    if (!routeDatas.length) return [[], null]
    let _navs = extraNavs(routeDatas)
    let validRoutes = extraValid(routeDatas)
    let routes = extraRoutes(validRoutes)
    let first = validRoutes.find(isShow)
    routes.push(buildFirst(first))
    routes.push(
      <Route path="*" key="notfound">
        <NotMatch />
      </Route>
    )
    let showingLinks = initLinks(location, first, validRoutes)
    setLinks(showingLinks)

    setvalidRoutes(validRoutes)
    return [
      _navs,
      <Content style={{ margin: '24px 16px 0', overflow: 'auto' }}>
        <div
          style={{
            padding: 24,
            background: '#fff',
            minHeight: 360,
          }}
        >
          <React.Suspense fallback={<p>loading...</p>}>
            <Switch>{routes}</Switch>
          </React.Suspense>
        </div>
      </Content>,
    ]
    //eslint-disable-next-line
  }, [routeDatas])

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        breakpoint="lg"
        collapsedWidth="80"
        trigger={null}
        collapsed={collapsed}
      >
        {/* <Logo /> */}
        <BigText>{!collapsed && 'React Admin'}</BigText>
        {/* // 自動反白當前路徑 */}
        <MenuNav routes={navs} currLocation={location.pathname} />
      </Sider>
      <Layout>
        <SpaceBetweenHeader>
          {ToggleMemo}
          <Breadcrumb style={centerSty}>
            {links.map(extraBreadcrumb)}
          </Breadcrumb>
          <div className="right">
            {LocalActionMemo}
            {UserActionsMemo}
          </div>
        </SpaceBetweenHeader>
        {MainMemo}
        {/* <Footer style={centerText}>React | Ant Design | StyledComponent | Redux </Footer> */}
      </Layout>
    </Layout>
  )
}

export default BacisLayout
