'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [smes, setSmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    long_description: '',
    category_slug: '',
    sme_id: '',
    featured: false,
    image: null as File | null,
  });

  const [smeForm, setSmeForm] = useState({
    name: '',
    short_description: '',
    description: '',
    story: '',
    city: '',
    province: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    facebook: '',
    established_date: '',
    category: '',
    featured: false,
    product_count: 0,
    logo: null as File | null,
    cover_image: null as File | null,
  });

  useEffect(() => {
    checkSession();
    fetchProducts();
    fetchCategories();
    fetchSMEs();
  }, []);

  const checkSession = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      router.push('/admin/login');
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const fetchSMEs = async () => {
    const { data } = await supabase.from('smes').select('*');
    if (data) setSmes(data);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      alert('Produk berhasil ditambahkan!');
      setProductForm({
        name: '',
        price: '',
        description: '',
        long_description: '',
        category_slug: '',
        sme_id: '',
        featured: false,
        image: null,
      });
      fetchProducts();
    } else {
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const err = await res.json();
        alert(`Gagal tambah produk: ${err.error}`);
      } else {
        const text = await res.text();
        alert(`Gagal tambah produk: ${text}`);
      }
    }
  };

  const handleSmeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(smeForm).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch('/api/smes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      alert('UMKM berhasil ditambahkan!');
      setSmeForm({
        name: '',
        short_description: '',
        description: '',
        story: '',
        city: '',
        province: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        instagram: '',
        facebook: '',
        established_date: '',
        category: '',
        featured: false,
        product_count: 0,
        logo: null,
        cover_image: null,
      });
      fetchSMEs();
    } else {
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const err = await res.json();
        alert(`Gagal tambah UMKM: ${err.error}`);
      } else {
        const text = await res.text();
        alert(`Gagal tambah UMKM: ${text}`);
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Produk */}
        <form onSubmit={handleProductSubmit} encType="multipart/form-data" className="space-y-3">
          <h2 className="text-xl font-semibold mb-3">Tambah Produk</h2>
          <input type="text" placeholder="Nama Produk" required className="w-full border px-3 py-2"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          />
          <input type="number" placeholder="Harga" required className="w-full border px-3 py-2"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
          />
          <textarea placeholder="Deskripsi" required className="w-full border px-3 py-2"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          />
          <textarea placeholder="Deskripsi Panjang" className="w-full border px-3 py-2"
            value={productForm.long_description}
            onChange={(e) => setProductForm({ ...productForm, long_description: e.target.value })}
          />
          <select required className="w-full border px-3 py-2"
            value={productForm.category_slug}
            onChange={(e) => setProductForm({ ...productForm, category_slug: e.target.value })}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <select required className="w-full border px-3 py-2"
            value={productForm.sme_id}
            onChange={(e) => setProductForm({ ...productForm, sme_id: e.target.value })}
          >
            <option value="">Pilih UMKM</option>
            {smes.map((sme) => (
              <option key={sme.id} value={sme.id}>{sme.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={productForm.featured}
              onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
            />
            Featured
          </label>
          <input type="file" accept="image/*"
            onChange={(e) => setProductForm({ ...productForm, image: e.target.files?.[0] || null })}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Tambah Produk
          </button>
        </form>

        {/* Form SME */}
        <form onSubmit={handleSmeSubmit} encType="multipart/form-data" className="space-y-3">
          <h2 className="text-xl font-semibold mb-3">Tambah UMKM (SME)</h2>
          {[
            ['Nama UMKM', 'name'],
            ['Deskripsi Singkat', 'short_description'],
            ['Deskripsi', 'description'],
            ['Cerita', 'story'],
            ['Kota', 'city'],
            ['Provinsi', 'province'],
            ['Alamat', 'address'],
            ['Telepon', 'phone'],
            ['Email', 'email'],
            ['Website', 'website'],
            ['Instagram', 'instagram'],
            ['Facebook', 'facebook'],
            ['Kategori', 'category'],
          ].map(([label, key]) => (
            <input key={key} type="text" placeholder={label} required={['name', 'short_description', 'description'].includes(key)}
              value={(smeForm as any)[key]}
              onChange={(e) => setSmeForm({ ...smeForm, [key]: e.target.value })}
              className="w-full border px-3 py-2"
            />
          ))}
          <input type="date" value={smeForm.established_date}
            onChange={(e) => setSmeForm({ ...smeForm, established_date: e.target.value })}
            className="w-full border px-3 py-2"
          />
          <input type="number" placeholder="Jumlah Produk" value={smeForm.product_count}
            onChange={(e) => setSmeForm({ ...smeForm, product_count: Number(e.target.value) })}
            className="w-full border px-3 py-2"
          />
          <label className="block">
            <input type="checkbox" checked={smeForm.featured}
              onChange={(e) => setSmeForm({ ...smeForm, featured: e.target.checked })}
            />
            <span className="ml-2">Featured</span>
          </label>
          <input type="file" accept="image/*"
            onChange={(e) => setSmeForm({ ...smeForm, logo: e.target.files?.[0] || null })}
          />
          <input type="file" accept="image/*"
            onChange={(e) => setSmeForm({ ...smeForm, cover_image: e.target.files?.[0] || null })}
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Tambah UMKM
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Daftar Produk</h2>
        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {products.map((p) => (
            <li key={p.id} className="border p-3 rounded">
              <strong>{p.name}</strong> - Rp {p.price}
              <p className="text-sm text-gray-600">{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
