"use client"
import React from 'react'

export default function AdminPending({ items }: { items: any[] }) {
  return (
    <div className="space-y-4 mt-4">
      {items.map(p => (
        <div key={p.id} className="border p-3 rounded">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.description}</p>
          <div className="mt-2">
            <button
              className="mr-2 bg-green-600 text-white px-3 py-1 rounded"
              onClick={async () => {
                await fetch(`/api/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve' }) })
                window.location.reload()
              }}
            >Approve</button>
          </div>
        </div>
      ))}
    </div>
  )
}
