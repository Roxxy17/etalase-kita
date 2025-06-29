import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug') // pilih kolom yang diperlukan saja

  if (error) {
    console.error('Gagal mengambil data kategori:', error)
    return NextResponse.json({ error: 'Gagal mengambil data kategori' }, { status: 500 })
  }

  return NextResponse.json(data)
}
