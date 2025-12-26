import NavBar from '../../src/components/NavBar'
import ProductCard from '../../src/components/ProductCard'

export default async function ProductsPage() {
  const res = await fetch('/api/products', { cache: 'no-store' })
  const products = await res.json()

  return (
    <div>
      <NavBar />
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </main>
    </div>
  )
}
