"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, MapPin, Edit, Trash2, Eye, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { smes, products } from "@/lib/data"

export default function SMEsManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSMEs = smes.filter((sme) => {
    return (
      sme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sme.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sme.province.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getSMEProductCount = (smeId: number) => {
    return products.filter((p) => p.smeId === smeId).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Manajemen UMKM</h1>
              <p className="text-sm text-gray-500">Kelola semua UMKM terdaftar</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">Kembali ke Dashboard</Button>
              </Link>
              <Link href="/admin/dashboard/smes/add">
                <Button className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah UMKM
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Pencarian UMKM</CardTitle>
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
                <span className="text-sm text-gray-600">{filteredSMEs.length} UMKM ditemukan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMEs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar UMKM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UMKM</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSMEs.map((sme) => {
                    const productCount = getSMEProductCount(sme.id)

                    return (
                      <TableRow key={sme.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                              <Image
                                src={sme.logo || "/placeholder.svg?height=48&width=48"}
                                alt={sme.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{sme.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{sme.shortDescription}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{sme.city}</p>
                              <p className="text-sm text-gray-500">{sme.province}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sme.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{productCount} produk</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {sme.featured && (
                              <Badge className="bg-gold-100 text-gold-800">
                                <Star className="h-3 w-3 mr-1" />
                                Unggulan
                              </Badge>
                            )}
                            <Badge className="bg-green-100 text-green-800">Aktif</Badge>
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
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
