import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const smeId = Number(params.id);

  const { data, error } = await supabase
    .from('smes')
    .select('*')
    .eq('id', smeId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(data);
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await req.json()

  // Hapus kolom `id` dari update agar tidak bentrok
  const { id: _, ...updatedFields } = body

  const { data, error } = await supabase
    .from('smes')
    .update(updatedFields)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'SME updated successfully', data })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const { error } = await supabase
    .from('smes')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'SME deleted successfully' })
}