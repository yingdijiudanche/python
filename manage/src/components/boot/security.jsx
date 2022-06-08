import React from 'react'
import { Redirect } from 'react-router-dom'
import BasicLayout from './basicLayout'
import tokenHolder from '../../utils/tokenHolder'

const Security = () => {
  const token = tokenHolder.get()
  if (token != null) {
    return <BasicLayout />
  }

  return (
    <Redirect
      to={`/login?redirect=${encodeURIComponent(window.location.href)}`}
    />
  )
}

export default Security
