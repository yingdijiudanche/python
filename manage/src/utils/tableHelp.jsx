import React from 'react'
import { Button, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import DatePicker from '../components/override/DatePicker'
import intl from 'intl-lightly'
/**
 * @param {buildDrodown} buildChild
 */
const buildFilter = buildChild => ({
  filterDropdown: props => (
    <div style={{ padding: 8 }}>
      <Space>
        <Button
          onClick={() => {
            props.setSelectedKeys([])
            props.clearFilters()
          }}
          size="small"
          style={{ width: 90 }}
        >
          {intl.get('buttons.reset')}
        </Button>
        <Button
          type="primary"
          onClick={props.confirm}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          {intl.get('buttons.search')}
        </Button>
      </Space>
      <div style={{ marginTop: 8 }}>{buildChild(props)}</div>
    </div>
  ),
})
/**
 *
 * @param {import('antd/lib/table/interface').FilterDropdownProps} props
 */
const timeRange = ({ selectedKeys, setSelectedKeys }) => (
  <DatePicker.RangePicker
    defaultPickerValue={dayjs()}
    value={selectedKeys.map(v => (v ? dayjs(v) : undefined))}
    onChange={moments => {
      if (!moments) return
      setSelectedKeys(moments.map(d => d.valueOf()))
    }}
  />
)
const buildTimeRangeFilter = () => buildFilter(timeRange)

export { buildFilter, buildTimeRangeFilter }
/**
 *  @callback buildDrodown
 * @param {import('antd/lib/table/interface').FilterDropdownProps} props
 */
