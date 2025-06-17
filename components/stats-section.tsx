import { TrendingUp, Users, MapPin, ShoppingBag } from "lucide-react"

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "150+",
    label: "UMKM Terdaftar",
    color: "from-ocean-500 to-ocean-600",
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    value: "800+",
    label: "Produk Lokal",
    color: "from-coral-500 to-coral-600",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    value: "25+",
    label: "Provinsi",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "10K+",
    label: "Pengunjung",
    color: "from-emerald-500 to-emerald-600",
  },
]

export function StatsSection() {
  return (
    <section className="w-full py-20 bg-white relative">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
