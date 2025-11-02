'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaBox, FaNewspaper, FaCog, FaSignOutAlt } from 'react-icons/fa'
import { useAuth, signOut, isAdminEmail } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
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

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-primary-900">
              Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/admin/dashboard"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-all hover:border-gold-500 group"
            >
              <FaCog className="text-4xl text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                Dashboard
              </h2>
              <p className="text-gray-600">
                View sales, orders, and revenue statistics
              </p>
            </Link>

            <Link
              href="/admin/products"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-all hover:border-gold-500 group"
            >
              <FaBox className="text-4xl text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                Products
              </h2>
              <p className="text-gray-600">
                Manage engagement rings, wedding rings, and jewellery products
              </p>
            </Link>
            
            <Link
              href="/admin/blog"
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-all hover:border-gold-500 group"
            >
              <FaNewspaper className="text-4xl text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                Blog Posts
              </h2>
              <p className="text-gray-600">
                Create and manage blog posts
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
