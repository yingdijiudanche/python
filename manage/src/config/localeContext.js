import React from 'react'
//这些引用库的语言包，加起来没有20k，不用担心
import zhHK from 'antd/es/locale/zh_TW' //antd 暫時沒有香港語言包
import enGB from 'antd/es/locale/en_GB'
import 'dayjs/locale/zh-hk.js'
import 'dayjs/locale/en-gb.js'

const antdLocales = {
  'en-gb': enGB,
  'zh-hk': zhHK,
}
const langsOptions = [
  { value: 'en-gb', label: 'English' },
  { value: 'zh-hk', label: '中文繁體' },
]
const localeContext = React.createContext(langsOptions[0].value)
const LocalProvider = localeContext.Provider

export { localeContext, LocalProvider, langsOptions, antdLocales }
