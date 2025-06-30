import Link from "next/link"
import { ArrowRight, Sparkles, Crown, Shield, Award, Star, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/animated-section"
import FeaturedSMEs from "@/components/featured-smes"
import ProductCard from "@/components/product-card"
import { ElegantTestimonials } from "@/components/elegant-testimonials"
import { ElegantStats } from "@/components/elegant-stats"

export default async function Home() {
  const [productsRes, smesRes, categoriesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/smes`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, { cache: "no-store" }),
  ])

  const [products, smes, categories] = await Promise.all([
    productsRes.json(),
    smesRes.json(),
    categoriesRes.json(),
  ])
const totalProducts = products.length
const totalSMEs = smes.length
const totalProvinces = new Set(smes.map((sme: any) => sme.province)).size
  const featuredProducts = products.filter((product: any) => product.featured).slice(0, 8)
  const featuredSMEs = smes.filter((sme: any) => sme.featured).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden elegant-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
        </div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gold-300/30 rounded-full blur-2xl animate-pulse delay-500"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <AnimatedSection animation="fade" duration={1200} triggerOnce={true}>
            <div className="text-center space-y-8 max-w-5xl mx-auto">
              <AnimatedSection animation="scale" delay={300} triggerOnce={true}>
                <Badge className="glass-morphism text-white border-white/30 hover:bg-white/20 px-6 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Platform UMKM Premium Indonesia
                </Badge>
              </AnimatedSection>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white text-shadow">
                <span className="gold-gradient">Etalase</span>
                <span className="text-white">Kita</span>
              </h1>

              <AnimatedSection animation="fade" delay={600} triggerOnce={true}>
                <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                  Menghubungkan keunggulan kreativitas lokal dengan standar global. Temukan koleksi eksklusif dari UMKM terpilih Indonesia.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="scale" delay={900} triggerOnce={true}>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 text-lg font-semibold shadow-elegant-lg elegant-hover">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Jelajahi Koleksi
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold glass-morphism">
                    <Shield className="mr-2 h-5 w-5" />
                    Tentang Kami
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fade" delay={1500} triggerOnce={true} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm font-medium">Scroll untuk menjelajah</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </AnimatedSection>
      </section>

      {/* Stats */}
    <AnimatedSection animation="scale" className="py-20 bg-white">
  <ElegantStats
    totalProducts={totalProducts}
    totalSMEs={totalSMEs}
    totalProvinces={totalProvinces}
  />
</AnimatedSection>


      {/* Categories */}
      <AnimatedSection animation="fade" className="py-20 bg-gradient-to-b from-white to-midnight-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <AnimatedSection animation="scale">
              <h2 className="text-4xl md:text-5xl font-bold text-midnight-900 mb-4">Kategori Eksklusif</h2>
              <div className="section-divider"></div>
              <p className="text-xl text-midnight-600 max-w-3xl mx-auto">
                Jelajahi koleksi terpilih dari berbagai kategori produk kreatif Indonesia
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category: any, index: number) => (
              <AnimatedSection key={category.id} animation="scale" delay={index * 100} className="group cursor-pointer">
                <Link href={`/products?category=${category.slug}`}>
                  <div className="elegant-card p-6 text-center h-full elegant-hover">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-rose-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-midnight-800 group-hover:text-gold-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection animation="fade" className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-16">
            <AnimatedSection animation="scale">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-midnight-900 mb-4">Produk Unggulan</h2>
                <div className="section-divider !mx-0"></div>
                <p className="text-xl text-midnight-600">Koleksi terbaik pilihan kurator kami</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={200}>
              <Link href="/products">
                <Button variant="outline" className="border-2 border-gold-400 text-gold-600 hover:bg-gold-50 px-6 py-3 elegant-hover">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any, index: number) => (
              <AnimatedSection key={product.id} animation="scale" delay={index * 100}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured SMEs */}
      <AnimatedSection animation="fade" className="py-20 bg-gradient-to-br from-midnight-50 to-gold-50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-16">
            <AnimatedSection animation="scale">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-midnight-900 mb-4">UMKM Terpilih</h2>
                <div className="section-divider !mx-0"></div>
                <p className="text-xl text-midnight-600">Berkenalan dengan para maestro kreatif Indonesia</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={200}>
              <Link href="/smes">
                <Button variant="outline" className="border-2 border-gold-400 text-gold-600 hover:bg-gold-50 px-6 py-3 elegant-hover">
                  Lihat Semua UMKM
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
          <FeaturedSMEs smes={featuredSMEs} />
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection animation="scale" className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <AnimatedSection animation="fade">
              <h2 className="text-4xl md:text-5xl font-bold text-midnight-900 mb-4">Testimoni</h2>
              <div className="section-divider"></div>
              <p className="text-xl text-midnight-600 max-w-3xl mx-auto">
                Kepercayaan dan kepuasan pelanggan adalah prioritas utama kami
              </p>
            </AnimatedSection>
          </div>
          <ElegantTestimonials />
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection animation="fade" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 elegant-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container px-4 md:px-6 relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatedSection animation="scale">
              <Badge className="glass-morphism text-white border-white/30 hover:bg-white/20 px-6 py-2">
                <Star className="w-4 h-4 mr-2" />
                Bergabung dengan Komunitas Eksklusif
              </Badge>
            </AnimatedSection>

            <AnimatedSection animation="fade" delay={300}>
              <h2 className="text-4xl md:text-6xl font-bold text-shadow">
                Dukung Ekonomi Kreatif
                <span className="gold-gradient block mt-2">Indonesia</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection animation="fade" delay={600}>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Bergabunglah dengan ribuan pecinta produk lokal yang telah mempercayai kami sebagai jembatan menuju keunggulan UMKM Indonesia
              </p>
            </AnimatedSection>

            <AnimatedSection animation="scale" delay={900}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 text-lg font-semibold shadow-elegant-lg elegant-hover">
                  <Crown className="mr-2 h-5 w-5" />
                  Mulai Berbelanja
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold glass-morphism">
                  Pelajari Lebih Lanjut
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}