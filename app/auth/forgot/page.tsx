"use client"
import { useState } from 'react'

export default function ForgotPage() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    setDone(true)
  }

  return (
    <div className="max-w-md mx-auto py-12">
      {done ? <p>Check your email for reset instructions.</p> : (
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="w-full bg-orange-600 text-white p-2 rounded">Send reset link</button>
        </form>
      )}
    </div>
  )
}
