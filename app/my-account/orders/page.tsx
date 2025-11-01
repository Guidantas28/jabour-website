'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth, signOut } from '@/lib/auth'

interface Order {
  id: string
  customer_email: string
  customer_name: string
  items: any[]
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/my-account')
      } else {
        fetchOrders()
      }
    }
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
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
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href="/" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-serif font-bold text-primary-900">
                My Account
              </h1>
              <p className="text-gray-600 mt-2">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              My Orders
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Link
                  href="/engagement-rings"
                  className="text-gold-500 hover:text-gold-600 font-semibold"
                >
                  Start Shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary-900">
                          £{order.total_amount.toFixed(2)}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-primary-900 mb-2">Items:</h4>
                      <ul className="space-y-2">
                        {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {item.name}
                            {item.metal && ` - ${item.metal}`}
                            {item.diamondShape && ` - ${item.diamondShape}`}
                            <span className="ml-2 font-semibold">x{item.quantity || 1}</span>
                            <span className="ml-2">£{item.price?.toFixed(2) || '0.00'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

