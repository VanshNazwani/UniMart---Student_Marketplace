"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const path = usePathname()
  return (
    <nav className="w-full border-b py-4 px-6 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">UniMart</Link>
      <div className="space-x-4">
        <Link href="/products" className={path?.startsWith('/products') ? 'underline' : ''}>Products</Link>
        <Link href="/products/create" className={path === '/products/create' ? 'underline' : ''}>Sell</Link>
        <Link href="/dashboard" className={path === '/dashboard' ? 'underline' : ''}>Dashboard</Link>
        <Link href="/auth/login">Login</Link>
      </div>
    </nav>
  )
}
