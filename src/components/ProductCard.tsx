import Link from 'next/link'

type Props = {
  product: any
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-md p-4">
      <img src={product.images?.[0]} alt={product.title} className="h-40 w-full object-cover rounded" />
      <h3 className="mt-2 font-semibold">{product.title}</h3>
      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
      <div className="mt-3">
        <Link href={`/products/${product.id}`} className="text-blue-600">View</Link>
      </div>
    </div>
  )
}
