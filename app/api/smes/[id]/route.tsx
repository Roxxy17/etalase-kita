import { NextResponse } from 'next/server';
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
