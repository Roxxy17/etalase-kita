import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadToStorage(file: File, path: string, bucket: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { publicUrl } = supabaseAdmin.storage.from(bucket).getPublicUrl(path).data;
  return publicUrl;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !userData?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string);
    const description = formData.get('description') as string;
    const long_description = formData.get('long_description') as string;
    const category_slug = formData.get('category_slug') as string;
    const sme_id = parseInt(formData.get('sme_id') as string);
    const featured = formData.get('featured') === 'true';
    const imageFile = formData.get('image') as File;

    if (!name || isNaN(price) || !category_slug || isNaN(sme_id)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      const path = `products/${Date.now()}-${imageFile.name}`;
      imageUrl = await uploadToStorage(imageFile, path, 'etalasekita');
    }

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('products')
      .insert([{
        name,
        price,
        description,
        long_description,
        image: imageUrl,
        category_slug,
        sme_id,
        featured,
      }])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(insertData, { status: 201 });

  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const smeIds = searchParams.getAll('smeId');
  const categories = searchParams.getAll('category');

  let query = supabaseAdmin.from('products').select('*');

  if (smeIds.length > 0) {
    query = query.in('sme_id', smeIds.map(Number));
  }

  if (categories.length > 0) {
    query = query.in('category_slug', categories);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
