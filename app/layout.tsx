import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ScrollAnimationScript from "@/components/scroll-animation-script"
import LayoutWrapper from "@/components/LayoutWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EtalaseKita - Showcase UMKM Kreatif Lokal",
  description:
    "Platform showcase kolektif untuk menampilkan produk dan profil UMKM kreatif lokal dalam satu platform digital yang estetik dan profesional.",
  generator: 'v0.dev'
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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
        <ScrollAnimationScript />
      </body>
    </html>
  )
}
