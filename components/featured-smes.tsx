import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, ArrowRight, Users, Award } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "./animated-section"

interface FeaturedSMEsProps {
  smes: Array<{
    id: number
    name: string
    logo?: string
    coverImage?: string
    shortDescription: string
    city: string
    province: string
    featured?: boolean
  }>
}

export default function FeaturedSMEs({ smes }: FeaturedSMEsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {smes.map((sme, index) => (
        <AnimatedSection key={sme.id} animation="scale" delay={index * 150}>
          <Card className="overflow-hidden h-full elegant-card border-0 shadow-elegant hover:shadow-elegant-lg group">
            <div className="aspect-[16/10] relative overflow-hidden">
              <Image
                src={sme.coverImage || "/placeholder.svg?height=200&width=400"}
                alt={sme.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />

              {/* Elegant gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/90 via-midnight-900/30 to-transparent"></div>

              {/* Logo with elegant styling */}
              <div className="absolute bottom-6 left-6">
                <AnimatedSection animation="scale" delay={index * 150 + 200}>
                  <div className="w-20 h-20 relative rounded-2xl overflow-hidden border-4 border-white shadow-elegant-lg bg-white">
                    <Image
                      src={sme.logo || "/placeholder.svg?height=80&width=80"}
                      alt={sme.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </AnimatedSection>
              </div>

              {/* Featured badge */}
              {sme.featured && (
                <div className="absolute top-6 right-6">
                  <AnimatedSection animation="fade" delay={index * 150 + 100}>
                    <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 text-white border-0 shadow-elegant px-4 py-2">
                      <Award className="w-4 h-4 mr-1" />
                      Terpilih
                    </Badge>
                  </AnimatedSection>
                </div>
              )}
            </div>

            <CardContent className="p-8">
              <div className="space-y-6">
                <AnimatedSection animation="fade" delay={index * 150 + 150}>
                  <div>
                    <h3 className="font-bold text-2xl mb-3 text-midnight-800 group-hover:text-gold-600 transition-colors">
                      {sme.name}
                    </h3>

                    <div className="flex items-center text-midnight-500 mb-4">
                      <MapPin className="h-4 w-4 mr-2 text-gold-500" />
                      {sme.city}, {sme.province}
                    </div>

                    <p className="text-midnight-600 line-clamp-3 leading-relaxed">{sme.shortDescription}</p>
                  </div>
                </AnimatedSection>

                {/* Stats with elegant styling */}
                <AnimatedSection animation="scale" delay={index * 150 + 300}>
                  <div className="flex items-center justify-between py-4 border-t border-midnight-200">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center text-midnight-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">24 produk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? "text-gold-500 fill-current" : "text-midnight-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade" delay={index * 150 + 450}>
                  <Link href={`/smes/${sme.id}`}>
                    <Button className="w-full bg-gradient-to-r from-midnight-700 to-midnight-800 hover:from-midnight-800 hover:to-midnight-900 text-white border-0 shadow-elegant py-3 font-semibold elegant-hover">
                      Lihat Profil Lengkap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </AnimatedSection>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      ))}
    </div>
  )
}
