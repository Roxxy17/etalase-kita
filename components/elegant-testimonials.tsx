import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "CEO, Batik Nusantara",
    avatar: "/placeholder.svg?height=100&width=100&text=BS",
    content:
      "EtalaseKita memberikan platform yang sangat profesional untuk UMKM seperti kami. Kualitas layanan dan presentasi produk sangat memuaskan.",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Rahayu",
    role: "Kolektor Produk Lokal",
    avatar: "/placeholder.svg?height=100&width=100&text=SR",
    content:
      "Saya sangat terkesan dengan kurasi produk yang berkualitas tinggi. Setiap pembelian selalu melampaui ekspektasi saya.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ahmad Hidayat",
    role: "Pengrajin Keramik",
    avatar: "/placeholder.svg?height=100&width=100&text=AH",
    content:
      "Platform ini membantu produk keramik saya dikenal lebih luas dengan presentasi yang sangat elegan dan profesional.",
    rating: 5,
  },
]

export function ElegantTestimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <AnimatedSection key={testimonial.id} animation="fade" delay={index * 200}>
          <div className="elegant-card p-8 h-full relative elegant-hover">
            {/* Quote decoration */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-gold-400 to-rose-400 rounded-full flex items-center justify-center shadow-elegant">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-6">
              {/* Rating */}
              <AnimatedSection animation="scale" delay={index * 200 + 100}>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= testimonial.rating ? "text-gold-500 fill-current" : "text-midnight-300"
                      }`}
                    />
                  ))}
                </div>
              </AnimatedSection>

              {/* Content */}
              <p className="text-midnight-600 italic leading-relaxed text-lg">"{testimonial.content}"</p>

              {/* Author */}
              <AnimatedSection animation="fade" delay={index * 200 + 200}>
                <div className="flex items-center gap-4 pt-6 border-t border-midnight-200">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-3 border-gold-200 shadow-elegant">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-midnight-800 text-lg">{testimonial.name}</h4>
                    <p className="text-midnight-500">{testimonial.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  )
}
