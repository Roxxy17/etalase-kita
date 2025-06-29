import { NextResponse } from 'next/server';
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
