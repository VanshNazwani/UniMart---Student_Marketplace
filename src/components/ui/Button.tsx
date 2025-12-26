"use client"
import React from 'react'

export default function Button({ children, className = '', ...props }: any) {
  return (
    <button className={`inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white ${className}`} {...props}>
      {children}
    </button>
  )
}
