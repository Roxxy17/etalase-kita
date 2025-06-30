import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import ScrollAnimationScript from "@/components/scroll-animation-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EtalaseKita - Showcase UMKM Kreatif Lokal",
  description:
    "Platform showcase kolektif untuk menampilkan produk dan profil UMKM kreatif lokal dalam satu platform digital yang estetik dan profesional."
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            {/* <Header /> */}
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </div>
        </ThemeProvider>
        <ScrollAnimationScript />
      </body>
    </html>
  )
}
