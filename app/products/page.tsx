"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductCard from "@/components/product-card"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image?: string
  categorySlug: string
  smeId: number
  featured?: boolean
  createdAt: string
}

interface Category {
  id: number
  name: string
  slug: string
}

interface SME {
  id: number
  name: string
  city?: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [smes, setSMEs] = useState<SME[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [selectedSMEs, setSelectedSMEs] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()

      selectedCategories.forEach((cat) => {
        params.append("category", cat)
      })

      selectedSMEs.forEach((smeId) => {
        params.append("smeId", smeId)
      })

      const res = await fetch(`/api/products?${params.toString()}`)
      const raw = await res.json()

      const data: Product[] = raw.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        price: item.price,
        image: item.image,
        categorySlug: item.category_slug,
        smeId: item.sme_id,
        featured: item.featured,
        createdAt: item.created_at,
      }))

      setProducts(data)
    } catch (err) {
      console.error("Gagal fetch produk:", err)
    }
  }

  fetchProducts()
}, [selectedCategories, selectedSMEs])


  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories")
      const raw = await res.json()
      const data: Category[] = raw.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
      }))
      setCategories(data)
    }

    const fetchSMEs = async () => {
      const res = await fetch("/api/smes")
      const raw = await res.json()
      const data: SME[] = raw.map((item: any) => ({
        id: item.id,
        name: item.name,
        city: item.city,
      }))
      setSMEs(data)
    }

    fetchCategories()
    fetchSMEs()
  }, [])

  useEffect(() => {
    let result = [...products]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setFilteredProducts(result)
  }, [products, searchQuery, priceRange, sortBy])

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug) ? prev.filter((c) => c !== categorySlug) : [...prev, categorySlug]
    )
  }

  const handleSMEChange = (smeId: string) => {
    setSelectedSMEs((prev) =>
      prev.includes(smeId) ? prev.filter((id) => id !== smeId) : [...prev, smeId]
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Produk UMKM</h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="price-asc">Harga: Rendah ke Tinggi</SelectItem>
              <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
              <SelectItem value="name-asc">Nama: A-Z</SelectItem>
              <SelectItem value="name-desc">Nama: Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Produk</SheetTitle>
                <SheetDescription>Pilih filter untuk menyaring produk</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Kategori</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-mobile-${category.id}`}
                          checked={selectedCategories.includes(category.slug)}
                          onCheckedChange={() => handleCategoryChange(category.slug)}
                        />
                        <Label htmlFor={`category-mobile-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">UMKM</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {smes.map((sme) => (
                      <div key={sme.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sme-mobile-${sme.id}`}
                          checked={selectedSMEs.includes(sme.id.toString())}
                          onCheckedChange={() => handleSMEChange(sme.id.toString())}
                        />
                        <Label htmlFor={`sme-mobile-${sme.id}`}>{sme.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Desktop Filters */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Filter</h3>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Kategori</h4>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.slug)}
                      onCheckedChange={() => handleCategoryChange(category.slug)}
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">UMKM</h4>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {smes.map((sme) => (
                  <div key={sme.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sme-${sme.id}`}
                      checked={selectedSMEs.includes(sme.id.toString())}
                      onCheckedChange={() => handleSMEChange(sme.id.toString())}
                    />
                    <Label htmlFor={`sme-${sme.id}`}>{sme.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredProducts.length} produk
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">Tidak ada produk yang ditemukan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}