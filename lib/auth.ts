'use client'

import { supabase } from './supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Lista de emails permitidos para acesso admin
const ALLOWED_ADMIN_EMAILS = [
  'info@jabourjewellery.com',
  'guilhermedantas788@gmail.com'
]

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())
}

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      setUser(data?.session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login')
      } else if (!isAdminEmail(user.email)) {
        // Usuário não tem permissão admin, fazer logout e redirecionar
        supabase.auth.signOut().then(() => {
          router.push('/admin/login')
        })
      }
    }
  }, [user, loading, router])

  return { user, loading }
}

export async function signOut() {
  await supabase.auth.signOut()
}
