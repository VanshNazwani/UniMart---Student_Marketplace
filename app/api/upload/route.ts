import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: Request) {
  const { image } = await request.json()
  if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  try {
    const res = await cloudinary.uploader.upload(image, { folder: 'unimart' })
    return NextResponse.json({ url: res.secure_url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
