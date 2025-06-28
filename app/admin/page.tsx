'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '' });

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
    fetchProducts();
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, price, description } = productForm;
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price: Number(price), description }),
    });

    if (res.ok) {
      setProductForm({ name: '', price: '', description: '' });
      fetchProducts();
    } else {
      const err = await res.json();
      alert(`Gagal tambah produk: ${err.error}`);
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
      alert('SME berhasil ditambahkan!');
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
    } else {
      const err = await res.json();
      alert(`Gagal tambah SME: ${err.error}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form SME */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Tambah UMKM (SME)</h2>
          <form onSubmit={handleSmeSubmit} className="space-y-3" encType="multipart/form-data">
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
              <input
                key={key}
                type="text"
                placeholder={label}
                value={(smeForm as any)[key]}
                onChange={(e) => setSmeForm({ ...smeForm, [key]: e.target.value })}
                className="w-full border px-3 py-2"
                required={['name', 'short_description', 'description'].includes(key)}
              />
            ))}

            <input
              type="date"
              value={smeForm.established_date}
              onChange={(e) => setSmeForm({ ...smeForm, established_date: e.target.value })}
              className="w-full border px-3 py-2"
            />

            <input
              type="number"
              placeholder="Jumlah Produk"
              value={smeForm.product_count}
              onChange={(e) => setSmeForm({ ...smeForm, product_count: Number(e.target.value) })}
              className="w-full border px-3 py-2"
            />

            <label className="block">
              <input
                type="checkbox"
                checked={smeForm.featured}
                onChange={(e) => setSmeForm({ ...smeForm, featured: e.target.checked })}
              />
              <span className="ml-2">Featured</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSmeForm({ ...smeForm, logo: e.target.files?.[0] || null })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSmeForm({ ...smeForm, cover_image: e.target.files?.[0] || null })}
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tambah UMKM
            </button>
          </form>
        </div>

        {/* Produk */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Tambah Produk</h2>
          <form onSubmit={handleProductSubmit} className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Nama Produk"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full border px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Harga"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              className="w-full border px-3 py-2"
              required
            />
            <textarea
              placeholder="Deskripsi"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full border px-3 py-2"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tambah Produk
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-2">Daftar Produk</h2>
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
    </div>
  );
}
