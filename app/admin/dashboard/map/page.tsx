"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Search, Edit, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { smes } from "@/lib/data"

export default function MapManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSMEs = smes.filter((sme) => {
    return (
      sme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sme.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Manajemen Peta</h1>
              <p className="text-sm text-gray-500">Kelola lokasi UMKM di peta</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">Kembali ke Dashboard</Button>
              </Link>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Lokasi
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Pencarian Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari UMKM berdasarkan nama atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{filteredSMEs.length} lokasi ditemukan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Peta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Preview Peta Interaktif</p>
                  <p className="text-sm text-gray-500">Akan menampilkan lokasi UMKM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Lokasi UMKM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredSMEs.map((sme) => (
                  <div key={sme.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{sme.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {sme.city}, {sme.province}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sme.featured && <Badge className="bg-purple-100 text-purple-800">Unggulan</Badge>}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-purple-600">{smes.length}</p>
              <p className="text-sm text-gray-600">Total Lokasi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-green-600">
                {smes.filter((s) => s.province === "DI Yogyakarta").length}
              </p>
              <p className="text-sm text-gray-600">Yogyakarta</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {smes.filter((s) => s.province === "Jawa Tengah").length}
              </p>
              <p className="text-sm text-gray-600">Jawa Tengah</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-gold-600">{smes.filter((s) => s.featured).length}</p>
              <p className="text-sm text-gray-600">Lokasi Unggulan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
