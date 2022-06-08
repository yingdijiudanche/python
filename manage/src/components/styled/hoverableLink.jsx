import { Link } from 'react-router-dom'
import styled from 'styled-components'

/** @type {import('react-router-dom').Link} */

const HoverableLink = styled(Link)`
  &:hover {
    transform: scale(1.5);
    border: 1px solid #e6e6e6;
  }
  transition: transform 0.26s;
  display: block;
  text-align: center;
  min-width: 20px;
  min-height: 20px;
`
export default HoverableLink
