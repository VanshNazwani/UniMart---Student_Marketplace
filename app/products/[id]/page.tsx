import NavBar from '../../../src/components/NavBar'
import BuyButton from '../../../src/components/BuyButton'

async function getProduct(id: string) {
  const res = await fetch(`/api/products/${id}`, { cache: 'no-store' })
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return (
    <div>
      <NavBar />
      <main className="p-6 max-w-3xl mx-auto">
        <img src={product.images?.[0]} className="w-full h-80 object-cover rounded" />
        <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
        <p className="mt-2">{product.description}</p>
        <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
        <BuyButton productId={product.id} />
      </main>
    </div>
  )
}

