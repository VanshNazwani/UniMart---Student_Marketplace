"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateProduct() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('Used')
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()

  async function toBase64(file: File) {
    return new Promise<string>((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res(reader.result as string)
      reader.onerror = rej
      reader.readAsDataURL(file)
    })
  }

  async function handleUpload(e: any) {
    const file = e.target.files?.[0]
    if (!file) return
    const b = await toBase64(file)
    const r = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b }) })
    const j = await r.json()
    if (j.url) setImages(prev => [...prev, j.url])
  }

  async function submit(e: any) {
    e.preventDefault()
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, price: Number(price), category, condition, images }) })
    if (res.ok) router.push('/dashboard')
    else alert('Failed')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Listing</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full border p-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input className="w-full border p-2" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <input className="w-full border p-2" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <select className="w-full border p-2" value={condition} onChange={e => setCondition(e.target.value)}>
          <option>New</option>
          <option>Used</option>
        </select>
        <input type="file" onChange={handleUpload} />
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => <img key={i} src={src} className="h-24 w-full object-cover" />)}
        </div>
        <button className="w-full bg-green-600 text-white p-2 rounded">Create</button>
      </form>
    </div>
  )
}
