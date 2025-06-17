import Image from "next/image"
import Link from "next/link"
import { MapPin, Heart, Star, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { smes } from "@/lib/data"

interface ProductCardProps {
  product: {
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const sme = smes.find((s) => s.id === product.smeId)

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden h-full elegant-card border-0 shadow-elegant hover:shadow-elegant-lg group">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Elegant overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white border-0 shadow-elegant px-3 py-1">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Premium
              </Badge>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="icon"
              className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-midnight-600 shadow-elegant"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-midnight-600 shadow-elegant"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick view overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <Button className="w-full bg-white/95 backdrop-blur-sm text-midnight-800 hover:bg-white border-0 shadow-elegant font-semibold">
              Lihat Detail
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg line-clamp-1 text-midnight-800 group-hover:text-gold-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-midnight-500 text-sm line-clamp-2 mt-1">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-bold text-xl gold-gradient">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </p>

              {sme && (
                <div className="flex items-center text-xs text-midnight-400 bg-midnight-100 px-3 py-1 rounded-full">
                  <MapPin className="h-3 w-3 mr-1" />
                  {sme.city}
                </div>
              )}
            </div>

            {/* Rating and reviews */}
            <div className="flex items-center justify-between pt-2 border-t border-midnight-100">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? "text-gold-500 fill-current" : "text-midnight-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-midnight-500">(4.8)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
