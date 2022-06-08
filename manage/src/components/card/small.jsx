import React from 'react'
import { accepetColors } from './colorEnum'

const baseSty =
  'bg-gradient-to-tr -mt-10  rounded-xl text-white grid items-center w-24 h-24 py-4 px-4 justify-center mb-0'
/**
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.icon
 * @param {accepetColors} props.color
 * @param {string} props.title
 * @param {number} props.number
 * @param {string} props.since
 * @returns
 */
export default function SmallCard({ icon, color, title, number, since }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-wrap border-b border-gray-200">
        <div className={`${baseSty} ${color}`}>{icon}</div>
        <div className="w-full pl-4 max-w-full flex-grow flex-1 mb-2 text-right">
          <h5 className="text-gray-500 font-light tracking-wide text-base mb-1">
            {title}
          </h5>
          <span>{number}</span>
        </div>
      </div>
      <div className="text-sm text-gray-700 pt-4 flex items-center">
        <span className="font-light whitespace-nowrap">{since}</span>
      </div>
    </div>
  )
}
