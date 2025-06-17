import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pengusaha UMKM",
    avatar: "/placeholder.svg?height=100&width=100&text=BS",
    content:
      "EtalaseKita membantu UMKM saya mendapatkan lebih banyak pelanggan. Platform yang sangat profesional dan mudah digunakan!",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Rahayu",
    role: "Pembeli Setia",
    avatar: "/placeholder.svg?height=100&width=100&text=SR",
    content:
      "Saya senang bisa menemukan produk-produk UMKM berkualitas di satu platform. Sangat memudahkan untuk mendukung produk lokal.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ahmad Hidayat",
    role: "Pengrajin Batik",
    avatar: "/placeholder.svg?height=100&width=100&text=AH",
    content:
      "Berkat EtalaseKita, produk batik saya bisa dikenal lebih luas. Platform yang sangat membantu untuk UMKM seperti kami.",
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <div key={testimonial.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
          <Card className="overflow-hidden h-full modern-hover border-0 shadow-lg bg-white relative">
            {/* Quote icon */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-ocean-400 to-violet-500 rounded-full flex items-center justify-center">
              <Quote className="w-4 h-4 text-white" />
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= testimonial.rating ? "text-coral-500 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-ocean-200">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
