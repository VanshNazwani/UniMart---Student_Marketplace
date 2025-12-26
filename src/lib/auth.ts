import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      (session as any).user.role = token.role
      (session as any).user.id = token.sub
      return session
    }
    ,
    async signIn({ user, account, profile, email, credentials }) {
      // Enforce university-only email if configured or default to .edu
      const allowed = process.env.ALLOWED_EMAIL_DOMAIN || '.edu'
      const userEmail = (user as any).email || (email?.value as string)
      if (!userEmail) return false
      if (allowed === '.edu') return userEmail.endsWith('.edu')
      return userEmail.endsWith(allowed)
    }
  }
}

// Note: do not export NextAuth handler from here to avoid initializing handlers at import time.
