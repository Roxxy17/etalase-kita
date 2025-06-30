
import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = Number(params.id);

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await req.json()

  // Hapus kolom `id` dari update agar tidak bentrok
  const { id: _, ...updatedFields } = body

  const { data, error } = await supabase
    .from('categories')
    .update(updatedFields)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Categories updated successfully', data })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Category deleted successfully' })
}