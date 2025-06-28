import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Supabase admin client (gunakan service role key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  // Ambil token dari Authorization header
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')

  // Verifikasi token Supabase
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Jika user valid (punya JWT), langsung izinkan insert
  const body = await req.json()
  const { name, price, description } = body

  const { data: insertData, error: insertError } = await supabaseAdmin
    .from('products')
    .insert([{ name, price, description }])
    .select()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json(insertData[0], { status: 201 })
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const smeId = searchParams.get('smeId')
  const category = searchParams.get("category")
  let query = supabase.from('products').select('*')

  if (smeId) {
    query = query.eq('sme_id', smeId)
  }
  if (category) {
    query = query.eq("category_slug", category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}