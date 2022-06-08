import React from 'react'

const titleSty =
  'bg-gradient-to-tr -mt-10 mb-4 rounded-xl text-white grid items-center w-full h-24 py-4 px-8'

/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} props.extraTitle
 * @param {accepetColors} props.color
 * @param {string} props.color
 * @param {import('react').ReactNode} props.children
 *
 */
export default function BigCard({ title, extraTitle, color, children }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4">
      <div className={`${titleSty} ${color}`}>
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl">{title}</div>

          {extraTitle}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
