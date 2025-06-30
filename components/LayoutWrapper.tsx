'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from './header'
import Footer from './footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) return null // Atau bisa kasih spinner

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoggedIn && <Header />}
      <main className="flex-1">{children}</main>
      {!isLoggedIn && <Footer />}
    </div>
  )
}
