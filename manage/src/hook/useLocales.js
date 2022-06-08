import dayjs from 'dayjs'
import intl from 'intl-lightly'
import { useState, useEffect } from 'react'
import { antdLocales, langsOptions } from '../config/localeContext'
import { translateRoutes } from '../stores/action/route'
const langs = import.meta.glob('../locales/*.js')

/** 控制语言切换,此方法仅在App.jsx 使用*/
export default function useLocales(dispatch) {
  // 讀取保存的語言，如沒有保存則使用英文
  const [curLocale, setCurLocale] = useState(
    window.localStorage.getItem('locale') ?? langsOptions[0].value
  )
  const [isLocalReady, setLocalReady] = useState(false)
  /** @type {[AntdLocale,React.Dispatch<React.SetStateAction<AntdLocale>>]}*/
  const [antdLocale, setAntdLocale] = useState(antdLocales[curLocale])

  useEffect(() => {
    const fetchLocal = async locale => {
      setLocalReady(false)
      let localeData = await langs[`../locales/${locale}.js`]()

      intl.add(curLocale, localeData.default)
      intl.change(curLocale)
      dayjs.locale(curLocale)
      setAntdLocale(antdLocales[curLocale])
      dispatch(translateRoutes())
      setLocalReady(true)
    }

    window.localStorage.setItem('locale', curLocale) // 保存語言到Local Storage
    document.documentElement.lang = curLocale // 透過修改<html lang=""><html>，調用適當字體
    fetchLocal(curLocale)

    //eslint-disable-next-line
  }, [curLocale])

  return [isLocalReady, curLocale, antdLocale, setCurLocale]
}

/** @typedef {import('antd/lib/locale-provider').Locale} AntdLocale */
