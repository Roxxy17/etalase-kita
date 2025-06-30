"use client"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}