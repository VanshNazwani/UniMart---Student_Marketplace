"use client"
import React from 'react'

export default function BuyButton({ productId }: { productId: string }) {
  const onClick = async () => {
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) })
    const j = await res.json()
    if (j.url) window.location.href = j.url
    else alert('Checkout failed')
  }

  return <button onClick={onClick} className="mt-4 bg-blue-600 text-white p-2 rounded">Buy</button>
}
