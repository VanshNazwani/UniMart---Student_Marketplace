"use client"
import NavBar from '../../../src/components/NavBar'
import { useState, useEffect } from 'react'

export default function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [messages, setMessages] = useState<any[]>([])
  const [body, setBody] = useState('')

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    const res = await fetch(`/api/chat/${id}/messages`)
    const j = await res.json()
    setMessages(j)
  }

  async function send() {
    if (!body) return
    await fetch(`/api/chat/${id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }) })
    setBody('')
    fetchMessages()
  }

  return (
    <div>
      <NavBar />
      <main className="p-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          {messages.map(m => <div key={m.id} className="border p-2 rounded">{m.body}</div>)}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 border p-2 rounded" value={body} onChange={e => setBody(e.target.value)} />
          <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={send}>Send</button>
        </div>
      </main>
    </div>
  )
}
