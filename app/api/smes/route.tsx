import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function uploadToStorage(file: File, path: string, bucket: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw new Error(error.message)

  const { publicUrl } = supabaseAdmin.storage.from(bucket).getPublicUrl(path).data
  return publicUrl
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formData = await req.formData()

    // Ambil semua field text
    const fields = {
      name: formData.get('name') as string,
      short_description: formData.get('short_description') as string,
      description: formData.get('description') as string,
      story: formData.get('story') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
      instagram: formData.get('instagram') as string,
      facebook: formData.get('facebook') as string,
      established_date: formData.get('established_date') as string, // format: YYYY-MM-DD
      category: formData.get('category') as string,
      featured: formData.get('featured') === 'true',
      product_count: parseInt(formData.get('product_count') as string) || 0,
    }

    // Handle file upload (logo dan cover)
    let logoUrl = ''
    let coverUrl = ''
    const logo = formData.get('logo') as File
    const cover = formData.get('cover_image') as File

    if (logo && logo.size > 0) {
      const path = `logos/${Date.now()}-${logo.name}`
      logoUrl = await uploadToStorage(logo, path, 'etalasekita')
    }

    if (cover && cover.size > 0) {
      const path = `covers/${Date.now()}-${cover.name}`
      coverUrl = await uploadToStorage(cover, path, 'etalasekita')
    }

    // Insert data
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('smes')
      .insert([{
        ...fields,
        logo: logoUrl,
        cover_image: coverUrl,
      }])
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
