import NavBar from '../../src/components/NavBar'

export default async function ChatIndex() {
  const res = await fetch('/api/chat', { cache: 'no-store' })
  const chats = await res.json()

  return (
    <div>
      <NavBar />
      <main className="p-6">
        <h2 className="text-2xl font-bold">Chats</h2>
        <div className="space-y-3 mt-4">
          {chats.map((c: any) => (
            <a key={c.id} href={`/chat/${c.id}`} className="block border p-3 rounded">
              <div>Chat {c.id}</div>
              <div className="text-sm text-muted-foreground">{c.messages?.[0]?.body}</div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
