"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { supabase } from "@/lib/supabase";

export default function AddSME() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    story: "",
    city: "",
    province: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    facebook: "",
    established_date: "",
    category: "",
    featured: false,
    product_count: "0",
    logo: null as File | null,
    cover_image: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = (await supabase.auth.getSession()).data?.session?.access_token;
      if (!token) {
        alert("Kamu harus login terlebih dahulu.");
        return;
      }

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" || key === "cover_image") {
          if (value instanceof File) {
            form.append(key, value);
          }
        } else if (typeof value === "boolean") {
          form.append(key, String(value));
        } else if (value !== null && value !== undefined) {
          form.append(key, value);
        }
      });

      const res = await fetch("/api/smes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan UMKM");

      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard/smes"), 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Tambah UMKM</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              UMKM berhasil ditambahkan! Mengalihkan...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi UMKM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Nama" id="name" value={formData.name} onChange={handleInputChange} required />
              <InputField label="Deskripsi Singkat" id="short_description" value={formData.short_description} onChange={handleInputChange} required />
              <TextareaField label="Deskripsi Lengkap" id="description" value={formData.description} onChange={handleInputChange} />
              <TextareaField label="Cerita" id="story" value={formData.story} onChange={handleInputChange} />
              <InputField label="Kota" id="city" value={formData.city} onChange={handleInputChange} required />
              <InputField label="Provinsi" id="province" value={formData.province} onChange={handleInputChange} required />
              <InputField label="Alamat" id="address" value={formData.address} onChange={handleInputChange} />
              <InputField label="No. Telepon" id="phone" value={formData.phone} onChange={handleInputChange} />
              <InputField label="Email" id="email" value={formData.email} onChange={handleInputChange} />
              <InputField label="Website" id="website" value={formData.website} onChange={handleInputChange} />
              <InputField label="Instagram" id="instagram" value={formData.instagram} onChange={handleInputChange} />
              <InputField label="Facebook" id="facebook" value={formData.facebook} onChange={handleInputChange} />
              <InputField label="Tanggal Berdiri" id="established_date" type="date" value={formData.established_date} onChange={handleInputChange} />
              <InputField label="Kategori" id="category" value={formData.category} onChange={handleInputChange} required />
              <InputField label="Jumlah Produk" id="product_count" value={formData.product_count} type="number" onChange={handleInputChange} />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", Boolean(checked))
                  }
                />
                <Label htmlFor="featured">Tandai sebagai UMKM unggulan</Label>
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("logo", e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <Label htmlFor="cover_image">Gambar Sampul</Label>
                <Input
                  id="cover_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("cover_image", e.target.files?.[0] || null)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan UMKM
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  type?: string;
  required?: boolean;
};

function InputField({ label, id, value, onChange, type = "text", required = false }: InputFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        required={required}
      />
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
};

function TextareaField({ label, id, value, onChange }: TextareaFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        rows={4}
      />
    </div>
  );
}
