import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://etalasekita.vercel.app"

async function getProduct(id: string) {
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function getSME(id: string) {
  const res = await fetch(`${baseUrl}/api/smes/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function getCategory(slug: string) {
  const res = await fetch(`${baseUrl}/api/categories?slug=${slug}`, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.length > 0 ? data[0] : null
}

async function getRelatedProducts(categorySlug: string, currentId: string) {
  const res = await fetch(`${baseUrl}/api/products?categorySlug=${categorySlug}`, { cache: "no-store" })
  if (!res.ok) return []
  const data = await res.json()
  return data.filter((p: any) => p.id !== currentId).slice(0, 4)
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const [sme, category, relatedProducts] = await Promise.all([
    getSME(product.sme_id),
    getCategory(product.category_slug),
    getRelatedProducts(product.category_slug, product.id),
  ])

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square relative rounded-md overflow-hidden border">
                <Image
                  src={product.image || `/placeholder.svg?height=150&width=150&text=Image ${i}`}
                  alt={`${product.name} - Image ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Link href={`/smes/${product.sme_id}`} className="text-sm text-muted-foreground hover:underline">
              {sme?.name}
            </Link>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {category && <Badge variant="outline">{category.name}</Badge>}
              {product.featured && <Badge>Unggulan</Badge>}
            </div>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Deskripsi Produk</h3>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-muted-foreground">{product.long_description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Informasi UMKM</h3>
            {sme && (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 relative rounded-md overflow-hidden border">
                  <Image
                    src={sme.logo || "/placeholder.svg?height=64&width=64"}
                    alt={sme.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link href={`/smes/${sme.id}`} className="font-medium hover:underline">
                    {sme.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{sme.short_description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {sme.city}, {sme.province}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link
                href={`https://wa.me/${sme?.phone?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi Penjual
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/smes/${product.sme_id}`}>Lihat Profil UMKM</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// kintil