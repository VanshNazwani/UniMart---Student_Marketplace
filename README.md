# UniMart — Student Marketplace Platform

This repository is a scaffold for the UniMart student marketplace. It includes a Next.js 14 (App Router) + TypeScript starter, Prisma schema, API routes for authentication (NextAuth), products, Stripe checkout, Cloudinary upload, Tailwind CSS, and Zod validation.

Quick start
1. Copy `.env.example` to `.env` and fill the values.
2. Install dependencies:

```bash
npm install
npx prisma generate
```

3. Run database migrations (create your DB first):

```bash
npx prisma migrate dev --name init
```

4. Start dev server:

```bash
npm run dev
```

What I added
- Project config: `package.json`, `tsconfig.json`, `next.config.js`
- Tailwind setup: `tailwind.config.cjs`, `postcss.config.cjs`, `globals.css`
- Prisma schema: `prisma/schema.prisma` (Users, Products, Orders)
- Auth: `app/api/auth/[...nextauth]/route.ts` + `src/lib/auth.ts` using Prisma adapter
- Product API: `app/api/products` (list, create) and `app/api/products/[id]` (get, patch, delete)
- Stripe checkout: `app/api/checkout/route.ts` and webhook at `app/api/webhooks/stripe/route.ts`
- Cloudinary upload: `app/api/upload/route.ts`
- Minimal App Router pages: `app/layout.tsx` and `app/page.tsx`

Next steps
- Implement full frontend pages (auth UI, product CRUD, dashboards)
- Add tests and E2E flows
- Add RBAC UI for Admin
- Harden security: rate limiting, CSP, helmet, HTTPS enforcement via Vercel
- Setup CI, Vercel deployment settings, and managed Postgres (Neon or Supabase)

Deployment
- Use Vercel. Add the environment variables in Vercel dashboard using the `.env.example` keys.
- Configure Stripe webhook endpoint on Vercel to `https://<your-deployment>/api/webhooks/stripe`

Testing
- Run `npm run dev` and use the API routes. Use Postman or curl to test endpoints.

Integration details & deployment
- Set environment variables from `.env.example` in Vercel or your host. Key vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLOUDINARY_*`, `ALLOWED_EMAIL_DOMAIN` (optional, defaults to `.edu`).
- Use NeonDB or Supabase for PostgreSQL. Run `npx prisma migrate deploy` in production after `prisma generate`.
- Configure Stripe webhooks to `https://<your-deploy>/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.

Testing
- Run database migrations locally:
```bash
npx prisma migrate dev --name init
```
- Unit/API testing: use `vitest` or `jest` (not included). To manually test, use `curl` or Postman against `/api/*` routes.

Added features
- Chat: Prisma models + `/api/chat` and `/api/chat/[id]/messages` and UI at `/chat`.
- Wishlist: Prisma model + `/api/wishlist` and UI at `/wishlist`.
- Notifications: Prisma model + `/api/notifications` to fetch and mark read. Notifications created for purchases and checkout flows.
- University email enforcement: set `ALLOWED_EMAIL_DOMAIN` or default `.edu`. Enforced at signup and NextAuth `signIn` callback.

Security notes
- Protect admin endpoints and sensitive actions with role checks (server-side checks present). Add middleware/CSRF if needed.


This scaffold is production-oriented and includes the core building blocks requested. Ask me which part you'd like implemented next (full frontend pages, admin panel, or tests) and I'll continue.
# UniMart---Student_Marketplace