import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Select } from 'antd'
import { debounce } from '../utils/delay'

const defOpt = []
/**
 * 实时搜索选择器
 * @param {SelectProps} props
 */
export default function CustomSearchSelect({
  searchReq,
  onClear,
  searchKey = '~name',
  extra = {},
  defaultOptions = defOpt,
  buildOptions,
  onChange,
  ...rest
}) {
  const [searchOptions, setSearchOptions] = useState(defaultOptions)

  useEffect(() => {
    setSearchOptions(defaultOptions)
  }, [defaultOptions])

  const lastRef = useRef()
  const getOptions = useCallback(
    debounce(
      300,
      async (value = '') => {
        value = value.length > 0 ? value : undefined
        lastRef.current = value
        extra[searchKey] = value
        extra.limit = 10
        const res = await searchReq(extra)
        if (lastRef.current !== value) return
        setSearchOptions(res.data || [])
      }
      //eslint-disable-next-line
    ),
    [searchReq, extra]
  )
  if (buildOptions) {
    return (
      <Select
        showSearch
        onSearch={getOptions}
        onClear={() => {
          onClear && onClear()
          getOptions('')
        }}
        filterOption={false}
        showArrow={false}
        onChange={(value, opt) => {
          onChange(value, opt, searchOptions)
        }}
        allowClear
        {...rest}
      >
        {searchOptions.map(buildOptions)}
      </Select>
    )
  }
  return (
    <Select
      showSearch
      onSearch={getOptions}
      onClear={() => {
        onClear && onClear()
        getOptions('')
      }}
      filterOption={false}
      showArrow={false}
      onChange={(value, opt) => {
        onChange && onChange(value, opt, searchOptions)
      }}
      allowClear
      options={searchOptions}
      {...rest}
    />
  )
}

/**
 *
 * @typedef {import('antd/lib/select').SelectProps} SelectProps
 * @typedef {{label:string,value:string}} Option;
 *
 * @typedef {object} CustomProps
 * @property {(params:Object<string,any>)=>Promise} searchReq  api请求函数
 * @property {string} searchKey  搜索参数
 * @property {object} extra  接口其他参数
 * @property {Option[]}defaultOptions
 * @property {(value,option,options:[])} onChange 扩展后的onChange
 * @property {(options:Option[])=> React.ReactNode} buildOptions  自定义选项
 */
