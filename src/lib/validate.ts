import { z } from 'zod'
import { NextResponse } from 'next/server'

export async function validateBody<T extends z.ZodTypeAny>(req: Request, schema: T) {
  try {
    const body = await req.json()
    return schema.parse(body)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Invalid' }, { status: 400 })
  }
}
