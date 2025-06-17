import Link from "next/link"
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gradient-to-b from-white to-batik-50">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl text-batik-500">EtalaseKita</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Platform showcase kolektif untuk menampilkan produk dan profil UMKM kreatif lokal dalam satu platform
              digital yang estetik dan profesional.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-batik-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-batik-500"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-batik-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-batik-500"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="mailto:info@etalasekita.id"
                className="text-muted-foreground hover:text-batik-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:border-batik-500"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-batik-500 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-batik-300 mr-2"></span>
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-batik-500 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-batik-300 mr-2"></span>
                  Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/smes"
                  className="text-muted-foreground hover:text-batik-500 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-batik-300 mr-2"></span>
                  UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-muted-foreground hover:text-batik-500 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-batik-300 mr-2"></span>
                  Peta
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-batik-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Jl. Kreatif No. 123, Jakarta Selatan, DKI Jakarta, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-batik-500 flex-shrink-0" />
                <span className="text-muted-foreground">+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-batik-500 flex-shrink-0" />
                <span className="text-muted-foreground">info@etalasekita.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-batik-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-medium text-lg">Berlangganan Newsletter</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Dapatkan informasi terbaru tentang produk dan UMKM lokal
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Email Anda"
                className="w-full md:w-64 border-batik-200 focus:border-batik-500"
              />
              <Button className="bg-batik-500 hover:bg-batik-600 text-white">Langganan</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-batik-100 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} EtalaseKita. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-batik-500 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-batik-500 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
