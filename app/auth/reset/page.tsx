"use client"
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPage() {
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function submit(e: any) {
    e.preventDefault()
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) })
    if (res.ok) router.push('/auth/login')
    else alert('Failed')
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2" placeholder="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-red-600 text-white p-2 rounded">Reset password</button>
      </form>
    </div>
  )
}
