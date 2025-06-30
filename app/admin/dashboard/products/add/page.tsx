"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { supabase } from "@/lib/supabase";

export default function AddProduct() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    long_description: "",
    price: "",
    category_slug: "",
    sme_id: "",
    featured: false,
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [smes, setSmes] = useState<any[]>([]);

  React.useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/admin/login");
        return;
      }

      try {
        const [catRes, smeRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/smes"),
        ]);

        const [catData, smeData] = await Promise.all([
          catRes.json(),
          smeRes.json(),
        ]);

        setCategories(catData);
        setSmes(smeData);
      } catch (error) {
        console.error("Gagal mengambil kategori atau UMKM", error);
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetch();
  }, [router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = (await supabase.auth.getSession()).data?.session
        ?.access_token;

      if (!token) {
        alert("Kamu harus login terlebih dahulu.");
        return;
      }

      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("long_description", formData.long_description);
      form.append("price", formData.price);
      form.append("category_slug", formData.category_slug);
      form.append("sme_id", formData.sme_id);
      form.append("featured", String(formData.featured));
      if (formData.image) {
        form.append("image", formData.image);
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan produk");
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard/products"), 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }

    if (loading) {
      return (
        <p className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 font-semibold text-center shadow">
          Mengecek sesi login...
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tambah Produk Baru
                </h1>
                <p className="text-sm text-gray-500">
                  Tambahkan produk UMKM ke platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Produk berhasil ditambahkan! Mengalihkan ke halaman produk...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Produk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Produk *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Singkat *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="longDescription">Deskripsi Lengkap</Label>
                    <Textarea
                      id="longDescription"
                      value={formData.long_description}
                      onChange={(e) =>
                        handleInputChange("long_description", e.target.value)
                      }
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Harga (IDR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gambar Produk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label htmlFor="image">Unggah Gambar</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleInputChange("image", e.target.files?.[0] || null)
                      }
                    />
                    <p className="text-sm text-gray-500">
                      Format: JPG, PNG. Maksimal 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kategori & UMKM</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Kategori *</Label>
                    <Select
                      value={formData.category_slug}
                      onValueChange={(value) =>
                        handleInputChange("category_slug", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>UMKM *</Label>
                    <Select
                      value={formData.sme_id}
                      onValueChange={(value) =>
                        handleInputChange("sme_id", value)
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleInputChange("featured", checked)
                      }
                    />
                    <Label htmlFor="featured">Jadikan produk unggulan</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Produk
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
