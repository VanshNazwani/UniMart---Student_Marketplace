"use client"
import React from 'react'

export default function Input({ className = '', ...props }: any) {
  return <input className={`w-full rounded-md border p-2 ${className}`} {...props} />
}
