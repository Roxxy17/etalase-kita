import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client (gunakan service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    // Ambil token dari Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verifikasi token Supabase
    const {
      data: { user },
      error
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Jika user valid, izinkan insert
    const body = await req.json()
    const { name, short_description, description, logo, cover_image } = body

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('smes')
      .insert([{ name, short_description, description, logo, cover_image }])
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(insertData[0], { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('smes')
      .select('*')
      .order('created_at', { ascending: false }) // urut dari terbaru

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
