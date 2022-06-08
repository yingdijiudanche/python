import React, { useState, useRef } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Button, Space } from 'antd'
import Highlighter from 'react-highlight-words'
import intl from 'intl-lightly'

/** 封装表格内的文本搜索功能 返回columns配置对象*/
export default function useSearchColumn(title, cusStyle = {}) {
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()
  const handleClear = clear => {
    setSearchText('')
    clear()
  }
  const handleSearch = (v, confirm) => {
    if (!v || v.length <= 0) {
      setSearchText('');
    } else {
      setSearchText(v);
    }
    confirm()
  }

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={intl.getReplaced('placeholder.search', { title })}
            value={selectedKeys}
            ref={inputRef}
            onChange={e => setSelectedKeys(e.target.value)}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{
              width: 188,
              marginBottom: 8,
              display: 'block',
              ...cusStyle,
            }}
          />
          <Space>
            <Button
              onClick={() => handleClear(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              {intl.get('buttons.reset')}
            </Button>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              {intl.get('buttons.search')}
            </Button>
          </Space>
        </div>
      )
    },
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => inputRef.current.select())
      }
    },
    render: text =>
      searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  }
}
