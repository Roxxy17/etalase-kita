"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, Sun, Moon, ShoppingBag, Users, Map, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

export default function Header() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const routes = [
    { name: "Beranda", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Produk", path: "/products", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "UMKM", path: "/smes", icon: <Users className="h-4 w-4" /> },
    { name: "Peta", path: "/map", icon: <Map className="h-4 w-4" /> },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-500 to-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl gradient-text">EtalaseKita</span>
          </Link>

          <nav className="hidden md:flex gap-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive(route.path)
                    ? "bg-ocean-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-ocean-600 hover:bg-ocean-50"
                }`}
              >
                {route.icon}
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isSearchOpen ? (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Cari produk atau UMKM..."
                className="pl-10 pr-4 rounded-full border-gray-200 focus:border-ocean-500 bg-white/80 backdrop-blur-sm"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex rounded-full hover:bg-ocean-50 hover:text-ocean-600"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-ocean-50 hover:text-ocean-600"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-r-0 bg-white/95 backdrop-blur-lg">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-ocean-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-bold text-xl gradient-text">EtalaseKita</span>
              </Link>
              <nav className="flex flex-col gap-2">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(route.path)
                        ? "bg-ocean-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-ocean-600 hover:bg-ocean-50"
                    }`}
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
