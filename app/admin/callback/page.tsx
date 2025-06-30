'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email

      if (email === 'rifqidani23@gmail.com') {
        router.push('/admin')
      } else {
        router.push('/admin/login') // fallback jika bukan admin
      }
    }

    handleRedirect()
  }, [router])

  return <p className="text-center mt-20">Logging you in...</p>
}
