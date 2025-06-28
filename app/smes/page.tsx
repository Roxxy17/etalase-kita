"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SMEsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name-asc")
  const [allSMEs, setAllSMEs] = useState<any[]>([])
  const [filteredSMEs, setFilteredSMEs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const res = await fetch("/api/smes/")
        const data = await res.json()
        setAllSMEs(data.sort(sortSMEs(sortBy)))
        setFilteredSMEs(data.sort(sortSMEs(sortBy)))
      } catch (error) {
        console.error("Gagal memuat data UMKM", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSMEs()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query) {
      setFilteredSMEs([...allSMEs].sort(sortSMEs(sortBy)))
      return
    }

    const filtered = allSMEs.filter((sme) => {
      const name = sme.name?.toLowerCase() || ""
      const desc = sme.short_description?.toLowerCase() || ""
      const city = sme.city?.toLowerCase() || ""
      const province = sme.province?.toLowerCase() || ""

      return name.includes(query) || desc.includes(query) || city.includes(query) || province.includes(query)
    })


    setFilteredSMEs(filtered.sort(sortSMEs(sortBy)))
  }

  const handleSort = (value: string) => {
    setSortBy(value)
    setFilteredSMEs([...filteredSMEs].sort(sortSMEs(value)))
  }

  const sortSMEs = (sortType: string) => {
    return (a: any, b: any) => {
      switch (sortType) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "newest":
          return new Date(b.established_date).getTime() - new Date(a.established_date).getTime()
        case "oldest":
          return new Date(a.established_date).getTime() - new Date(b.established_date).getTime()
        default:
          return 0
      }
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Daftar UMKM</h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari UMKM..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama: A-Z</SelectItem>
              <SelectItem value="name-desc">Nama: Z-A</SelectItem>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSMEs.length > 0 ? (
            filteredSMEs.map((sme) => (
              <Link href={`/smes/${sme.id}`} key={sme.id} className="group">
                <Card className="overflow-hidden h-full transition-all hover:border-primary">
                  <div className="aspect-[3/1] relative">
                    <Image
                      src={sme.cover_image || "/placeholder.svg?height=200&width=600"}
                      alt={sme.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 right-0 p-2">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden border-2 border-background bg-background">
                        <Image
                          src={sme.logo || "/placeholder.svg?height=64&width=64"}
                          alt={sme.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{sme.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {sme.city}, {sme.province}
                        </div>
                      </div>
                      {sme.featured && <Badge>Unggulan</Badge>}
                    </div>
                    <p className="text-muted-foreground mt-4 line-clamp-2">{sme.short_description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {sme.product_count || Math.floor(Math.random() * 20) + 1} produk
                      </p>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">
                        Lihat Profil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">Tidak ada UMKM yang ditemukan</p>
              <p className="text-sm text-muted-foreground mt-1">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
