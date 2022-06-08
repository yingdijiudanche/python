import React from 'react'
import { Select } from 'antd'

/** 直接搜索选项 */
const filterOption = (input, option) =>
  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

/**
 * 已配置可筛选已有选项的选择器
 * @param {import('antd/lib/select').SelectProps} props
 */
export default function FilterableSelect(props) {
  return <Select showSearch filterOption={filterOption} {...props} />
}
