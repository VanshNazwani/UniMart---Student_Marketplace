import NavBar from '../../src/components/NavBar'

export default async function WishlistPage() {
  const res = await fetch('/api/wishlist', { cache: 'no-store' })
  const items = await res.json()

  return (
    <div>
      <NavBar />
      <main className="p-6">
        <h2 className="text-2xl font-bold">Wishlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {items.map((it: any) => (
            <div key={it.id} className="border p-3 rounded">
              <h3 className="font-semibold">{it.product.title}</h3>
              <p className="text-sm">${it.product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
