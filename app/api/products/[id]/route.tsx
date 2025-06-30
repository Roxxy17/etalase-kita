import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadImage(file: File, path: string, bucket: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) throw new Error(error.message);

  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path).data;
  return publicUrl;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Produk tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Produk berhasil dihapus" });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const formData = await req.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const long_description = formData.get("long_description") as string;
  const price = parseInt(formData.get("price") as string);
  const category_slug = formData.get("category_slug") as string;
  const sme_id = parseInt(formData.get("sme_id") as string);
  const featured = formData.get("featured") === "true";

  const imageFile = formData.get("image") as File;

  let imageUrl = "";
  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const path = `products/${Date.now()}-${imageFile.name}`;
    imageUrl = await uploadImage(imageFile, path, "etalasekita");
  }

  const updateData: any = {
    name,
    description,
    long_description,
    price,
    category_slug,
    sme_id,
    featured,
  };

  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Produk berhasil diperbarui", data });
}
