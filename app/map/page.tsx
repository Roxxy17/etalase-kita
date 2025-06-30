"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg border bg-muted/20 flex items-center justify-center">
      <p>Memuat peta...</p>
    </div>
  ),
})

export default function MapPage() {
  const [smes, setSMEs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSMEs, setFilteredSMEs] = useState<any[]>([])
  const [selectedSME, setSelectedSME] = useState<any | null>(null)

  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const res = await fetch("/api/smes")
        const data = await res.json()
        setSMEs(data)
        setFilteredSMEs(data)
      } catch (error) {
        console.error("Gagal mengambil data UMKM:", error)
      }
    }

    fetchSMEs()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (!query) {
      setFilteredSMEs(smes)
      return
    }

    const filtered = smes.filter(
      (sme) =>
        sme.name.toLowerCase().includes(query) ||
        sme.short_description?.toLowerCase().includes(query) ||
        sme.city?.toLowerCase().includes(query) ||
        sme.province?.toLowerCase().includes(query)
    )

    setFilteredSMEs(filtered)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Peta UMKM</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari UMKM..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* SME List */}
        <div className="order-2 md:order-1 h-[400px] md:h-[600px] overflow-y-auto border rounded-lg p-2">
          {filteredSMEs.length > 0 ? (
            <div className="space-y-2">
              {filteredSMEs.map((sme) => (
                <Card
                  key={sme.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSME?.id === sme.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedSME(sme)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden border flex-shrink-0">
                        <Skeleton className="w-full h-full absolute" />
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm truncate">{sme.name}</h3>
                          {sme.featured && <Badge className="ml-2 flex-shrink-0">Unggulan</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {sme.city}, {sme.province}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {sme.short_description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-sm font-medium">Tidak ada UMKM yang ditemukan</p>
              <p className="text-xs text-muted-foreground mt-1">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="order-1 md:order-2">
          <MapWithNoSSR
            smes={filteredSMEs}
            selectedSME={selectedSME}
            setSelectedSME={setSelectedSME}
          />
        </div>
      </div>
    </div>
  )
}