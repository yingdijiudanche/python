import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import rootReducer from './stores/reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { ConfigProvider } from 'antd'
import { LocalProvider } from './config/localeContext'
import Login from './views/login'
import NotMatch from './views/404'
import Security from './components/boot/security'
import useLocales from './hook/useLocales'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

const App = () => {
  const [isLocalReady, curLocale, antdLocale, setCurLocale] = useLocales(
    store.dispatch
  )

  return (
    <Provider store={store}>
      <ConfigProvider locale={antdLocale}>
        <LocalProvider value={{ isLocalReady, curLocale, setCurLocale }}>
          <Router>
            {isLocalReady && (
              <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/404" component={NotMatch} />
                <Route path="/" component={Security} />
              </Switch>
            )}
          </Router>
        </LocalProvider>
      </ConfigProvider>
    </Provider>
  )
}

export default App
