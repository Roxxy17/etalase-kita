import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Phone, Mail, ExternalLink, Instagram, Facebook } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import ProductCard from "@/components/product-card"

async function getSME(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/smes/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

async function getProductsBySME(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?smeId=${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export default async function SMEPage({ params }: { params: { id: string } }) {
  const sme = await getSME(params.id)
  if (!sme) notFound()

  const smeProducts = await getProductsBySME(params.id)

  return (
    <div>
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 lg:h-80 relative">
        <Image
          src={sme.cover_image || "/placeholder.svg?height=300&width=1200"}
          alt={`${sme.name} cover`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container px-4 md:px-6 relative">
        {/* SME Logo and Basic Info */}
        <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20">
          <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-xl overflow-hidden border-4 border-background bg-background">
            <Image
              src={sme.logo || "/placeholder.svg?height=160&width=160"}
              alt={sme.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 pt-2 md:pt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{sme.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {sme.city}, {sme.province}
                  </div>
                  {sme.featured && <Badge>UMKM Unggulan</Badge>}
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <Link
                    href={`https://wa.me/${sme.phone?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hubungi
                  </Link>
                </Button>
                {sme.website && (
                  <Button variant="outline" asChild>
                    <Link href={sme.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="products" className="mt-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="about">Tentang</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="py-6">
            {smeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {smeProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium">Belum ada produk</p>
                <p className="text-sm text-muted-foreground mt-1">UMKM ini belum menambahkan produk</p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="py-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Tentang {sme.name}</h2>
                  <p className="text-muted-foreground">{sme.description || sme.short_description}</p>
                </div>

                {sme.story && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Cerita Kami</h2>
                    <p className="text-muted-foreground">{sme.story}</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Informasi UMKM</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tahun Berdiri</p>
                      <p>{new Date(sme.established_date).getFullYear()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kategori</p>
                      <p>{sme.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lokasi</p>
                      <p>
                        {sme.city}, {sme.province}
                      </p>
                    </div>
                  </div>
                </div>

                {(sme.instagram || sme.facebook) && (
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-3">Media Sosial</h3>
                    <div className="space-y-3">
                      {sme.instagram && (
                        <Link
                          href={`https://instagram.com/${sme.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Instagram className="h-4 w-4" />@{sme.instagram}
                        </Link>
                      )}
                      {sme.facebook && (
                        <Link
                          href={sme.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="py-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Informasi Kontak</h2>

                <div className="space-y-4">
                  {sme.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Telepon / WhatsApp</p>
                        <Link
                          href={`tel:${sme.phone}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {sme.phone}
                        </Link>
                      </div>
                    </div>
                  )}

                  {sme.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <Link
                          href={`mailto:${sme.email}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {sme.email}
                        </Link>
                      </div>
                    </div>
                  )}

                  {sme.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Alamat</p>
                        <p className="text-muted-foreground">{sme.address}</p>
                        <p className="text-muted-foreground">
                          {sme.city}, {sme.province}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="aspect-[4/3] relative rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Peta+Lokasi"
                  alt="Lokasi UMKM"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
