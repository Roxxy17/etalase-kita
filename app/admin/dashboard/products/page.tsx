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

export default function ProductsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSME, setSelectedSME] = useState("all");

  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [smes, setSmes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesCategory =
      selectedCategory === "all" ||
      (product.category_slug && product.category_slug === selectedCategory);

    const matchesSME =
      selectedSME === "all" ||
      (product.sme_id && product.sme_id.toString() === selectedSME);

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

        // 🔥 Sort produk berdasarkan waktu terbaru (created_at descending)
        const sortedProducts = [...productsData].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const sortedSMEs = [...smesData].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setProducts(sortedProducts);
        setCategories(categoriesData);
        setSmes(sortedSMEs);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Manajemen Produk
              </h1>
              <p className="text-sm text-gray-500">Kelola semua produk UMKM</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">Kembali ke Dashboard</Button>
              </Link>
              <Link href="/admin/dashboard/products/add">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSME} onValueChange={setSelectedSME}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih UMKM" />
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

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} produk ditemukan
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {filteredProducts.map((product) => {
                    const sme = smes.find((s) => s.id === product.sme_id);
                    const category = categories.find(
                      (c) => c.slug === product.category_slug
                    );

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                              <Image
                                src={
                                  product.image ||
                                  "/placeholder.svg?height=48&width=48"
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description || "-"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {sme?.name || "UMKM tidak diketahui"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {sme?.city || "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category?.name || "Kategori tidak diketahui"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {product.price
                              ? new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumFractionDigits: 0,
                                }).format(product.price)
                              : "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {product.featured && (
                              <Badge className="bg-gold-100 text-gold-800">
                                <Star className="h-3 w-3 mr-1" />
                                Unggulan
                              </Badge>
                            )}
                            <Badge className="bg-green-100 text-green-800">
                              Aktif
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
