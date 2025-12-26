import NavBar from '../../src/components/NavBar'
import prisma from '../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../src/lib/auth'

export default async function Dashboard() {
  const session = await getServerSession(authOptions as any)
  const userId = (session?.user as any)?.id
  if (!userId) return <div>Please log in</div>

  const listings = await prisma.product.findMany({ where: { sellerId: userId } })

  return (
    <div>
      <NavBar />
      <main className="p-6">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {listings.map(l => (
            <div key={l.id} className="border p-3 rounded">
              <h3 className="font-semibold">{l.title}</h3>
              <p className="text-sm">Status: {l.status}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
