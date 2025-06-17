import { TrendingUp, Users, MapPin, ShoppingBag } from "lucide-react"
import { AnimatedSection } from "./animated-section"

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "200+",
    label: "UMKM Terpilih",
    description: "Dikurasi dengan standar kualitas tinggi",
    color: "from-midnight-600 to-midnight-700",
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    value: "1,200+",
    label: "Produk Eksklusif",
    description: "Koleksi produk berkualitas premium",
    color: "from-gold-500 to-gold-600",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    value: "30+",
    label: "Provinsi",
    description: "Jangkauan di seluruh Indonesia",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "25K+",
    label: "Pelanggan Puas",
    description: "Kepercayaan yang terus bertumbuh",
    color: "from-emerald-500 to-emerald-600",
  },
]

export function ElegantStats() {
  return (
    <div className="container px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <AnimatedSection key={index} animation="scale" delay={index * 150}>
            <div className="elegant-card p-8 text-center group elegant-hover">
              <div
                className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-elegant`}
              >
                {stat.icon}
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-midnight-800">{stat.value}</p>
                <p className="text-lg font-semibold text-midnight-700">{stat.label}</p>
                <p className="text-sm text-midnight-500">{stat.description}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
