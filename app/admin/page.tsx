import prisma from '../../src/lib/prisma'
import NavBar from '../../src/components/NavBar'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../src/lib/auth'
import AdminPending from '../../src/components/AdminPending'

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any)
  if (!session || (session.user as any).role !== 'ADMIN') return <div>Forbidden</div>
  const pending = await prisma.product.findMany({ where: { status: 'PENDING' } })
  const pendingSerializable = pending.map(p => ({ ...p, createdAt: p.createdAt?.toISOString?.() }))

  return (
    <div>
      <NavBar />
      <main className="p-6">
        <h2 className="text-2xl font-bold">Admin — Pending Listings</h2>
        <AdminPending items={pendingSerializable} />
      </main>
    </div>
  )
}
