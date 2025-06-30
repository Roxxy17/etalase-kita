"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Filter, Edit, Trash2, Eye, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSME, setSelectedSME] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEdit, setIsEdit] = useState(false);
 const [form, setForm] = useState<{
  name: string;
  description: string;
  long_description: string;
  price: number;
  image: File | string;
  category_slug: string;
  sme_id: number;
  featured: boolean;
}>({
  name: "",
  description: "",
  long_description: "",
  price: 0,
  image: "",
  category_slug: "",
  sme_id: 0,
  featured: false,
});


  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [smes, setSmes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category_slug === selectedCategory;
    const matchesSME =
      selectedSME === "all" || product.sme_id.toString() === selectedSME;
    return matchesSearch && matchesCategory && matchesSME;
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/admin/login");
        return;
      }

      try {
        setLoading(true);
        const [productsRes, categoriesRes, smesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/smes"),
        ]);
        const [productsData, categoriesData, smesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          smesRes.json(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setSmes(smesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        long_description: selectedProduct.long_description || "",
        price: selectedProduct.price || 0,
        image: selectedProduct.image || "",
        category_slug: selectedProduct.category_slug || "",
        sme_id: selectedProduct.sme_id || 0,
        featured: selectedProduct.featured || false,
      });
    }
  }, [selectedProduct]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdate = async () => {
  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("long_description", form.long_description);
    formData.append("price", form.price.toString());
    formData.append("category_slug", form.category_slug);
    formData.append("sme_id", form.sme_id.toString());
    formData.append("featured", form.featured.toString());

    // hanya kirim image jika berupa file baru
    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    const response = await fetch(`/api/products/${selectedProduct.id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      const { data: updatedProduct } = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setSelectedProduct(null);
    } else {
      console.error("Gagal memperbarui produk");
    }
  } catch (err) {
    console.error(err);
  }
};

  const smeMap = Object.fromEntries(smes.map((s) => [s.id, s]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Manajemen Produk</h1>
            <p className="text-sm text-gray-500">Kelola semua produk UMKM</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/dashboard">
              <Button variant="outline">Kembali</Button>
            </Link>
            <Link href="/admin/dashboard/products/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Tambah Produk
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filter section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSME} onValueChange={setSelectedSME}>
                <SelectTrigger>
                  <SelectValue placeholder="UMKM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua UMKM</SelectItem>
                  {smes.map((sme) => (
                    <SelectItem key={sme.id} value={sme.id.toString()}>
                      {sme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center text-sm text-gray-600 gap-2">
                <Filter className="w-4 h-4" /> {filteredProducts.length} produk
                ditemukan
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>UMKM</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description || "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{smeMap[product.sme_id]?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoryMap[product.category_slug]?.name || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(product.price || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" /> Unggulan
                          </Badge>
                        )}
                        <Badge className="bg-green-100 text-green-800">
                          Aktif
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEdit(false);
                            setSelectedProduct(product);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEdit(true);
                            setSelectedProduct(product);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Dialog Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Produk" : "Detail Produk"}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {isEdit ? (
                <>
                  <div>
                    <label className="text-sm font-medium">Nama Produk</label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Deskripsi Singkat
                    </label>
                    <Input
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Deskripsi Lengkap
                    </label>
                    <Input
                      value={form.long_description}
                      onChange={(e) =>
                        setForm({ ...form, long_description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Harga</label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: parseFloat(e.target.value) })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Gambar Produk</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setForm({ ...form, image: file });
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Kategori</label>
                    <Select
                      value={form.category_slug}
                      onValueChange={(value) =>
                        setForm({ ...form, category_slug: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">UMKM</label>
                    <Select
                      value={form.sme_id.toString()}
                      onValueChange={(value) =>
                        setForm({ ...form, sme_id: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih UMKM" />
                      </SelectTrigger>
                      <SelectContent>
                        {smes.map((sme) => (
                          <SelectItem key={sme.id} value={sme.id.toString()}>
                            {sme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={form.featured}
                      onCheckedChange={(val) =>
                        setForm({ ...form, featured: !!val })
                      }
                    />
                    <label className="text-sm">Produk Unggulan</label>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Nama:</strong> {selectedProduct.name}
                  </p>
                  <p>
                    <strong>Deskripsi Singkat:</strong>{" "}
                    {selectedProduct.description}
                  </p>
                  <p>
                    <strong>Deskripsi Lengkap:</strong>{" "}
                    {selectedProduct.long_description}
                  </p>
                  <p>
                    <strong>Harga:</strong> Rp {selectedProduct.price}
                  </p>
                  <p>
                    <strong>Kategori:</strong> {selectedProduct.category_slug}
                  </p>
                  <p>
                    <strong>UMKM:</strong> {selectedProduct.sme_id}
                  </p>
                  <p>
                    <strong>Gambar:</strong>{" "}
                    <a
                      href={selectedProduct.image}
                      className="text-blue-500 underline"
                      target="_blank"
                    >
                      Lihat Gambar
                    </a>
                  </p>
                  <p>
                    <strong>Unggulan:</strong>{" "}
                    {selectedProduct.featured ? "Ya" : "Tidak"}
                  </p>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Tutup</Button>
            </DialogClose>
            {isEdit && <Button onClick={handleUpdate}>Simpan Perubahan</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
