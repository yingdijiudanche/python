import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import axios from 'axios'
import styled from 'styled-components'
import base from '../../config/base'
import IconFont from './iconFont'

const idMatchReg = /(?<=id=\")[^]{0,30}(?=\" viewBox)/g
const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 380ms;

  padding: 10px;
  min-width: 80px;
  z-index: 2;

  & > .anticon {
    font-size: 36px;
    margin-bottom: 10px;
  }
  &:hover {
    color: white;
    background-color: #2e7cc6;
    & > .anticon {
      transform: scale(1.2);
    }
  }
`
const emptyCardSty = {
  border: '1px solid #d9d9d9;',
}
async function getIconNames(update) {
  const url = `http:${base.iconfontScriptUrl}`
  const res = await axios.get(url, { responseType: 'text' })
  if (res.status !== 200) return console.error(res.statusText)
  const names = Array.from(res.data.matchAll(idMatchReg), x => x[0])
  update(names)
}

export default function IconPan({ onClickOne, selected, showEmpty = true }) {
  const [iconNames, setIconNames] = useState([])

  useEffect(() => {
    getIconNames(setIconNames)
  }, [])

  const handelClick = name => e => {
    onClickOne?.(name)
  }
  return (
    <Row wrap gutter={10}>
      {showEmpty && (
        <Col key="empty" style={emptyCardSty} onClick={handelClick('')}>
          <IconCard></IconCard>
        </Col>
      )}
      {iconNames.map(v => (
        <Col
          key={v}
          onClick={handelClick(v)}
          style={selected === v ? { color: '#2e7cc6' } : null}
        >
          <IconCard>
            <IconFont type={v} />
            <div>{v.replace('icon-', '')}</div>
          </IconCard>
        </Col>
      ))}
    </Row>
  )
}
