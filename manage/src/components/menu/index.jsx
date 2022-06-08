import React, { useContext, useState } from 'react'

const menuContext = React.createContext(false)
const MenuProvider = menuContext.Provider
const baseItemSty =
  'flex items-center gap-4 text-sm  font-light px-4 py-3 rounded-lg'
const seletedSty =
  'bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md'

/**
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.logo
 * @param {string} props.defaultSelectedKey
 * @returns
 */
function CustomMenu({ logo, children, defaultSelectedKey }) {
  const [current, setCurrent] = useState(defaultSelectedKey)
  const onChange = key => () => setCurrent(key)

  children = children.map(child => {
    if (child.type.name === 'Item') {
      return React.cloneElement(child, { eventKey: child.key })
    }
    return child
  })

  return (
    <MenuProvider value={{ current, onChange }}>
      <div className="flex-col items-stretch min-h-full flex-nowrap px-0 relative w-48">
        {logo}
        <div className="flex flex-col">
          <hr className="my-4 min-w-full" />
          <ul className="flex-col min-w-full flex list-none">{children}</ul>
        </div>
      </div>
    </MenuProvider>
  )
}

/**
 *
 * @param {object} props
 */
CustomMenu.Item = function Item({ children, icon, eventKey }) {
  const { current, onChange = () => {} } = useContext(menuContext)

  return (
    <li className="rounded-lg mb-2" onClick={onChange(eventKey)}>
      <div
        className={`${baseItemSty} ${
          current === eventKey ? seletedSty : 'text-gray-700'
        }`}
      >
        {icon}
        {children}
      </div>
    </li>
  )
}

export default CustomMenu
