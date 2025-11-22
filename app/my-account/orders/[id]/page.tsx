'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

// Helper function to format metal names
const formatMetal = (metal: string): string => {
  const metalMap: Record<string, string> = {
    'platinum': 'Platinum',
    '18k-white-gold': '18k White Gold',
    '18k-yellow-gold': '18k Yellow Gold',
    '18k-rose-gold': '18k Rose Gold',
    '9k-white-gold': '9k White Gold',
    '9k-yellow-gold': '9k Yellow Gold',
    '9k-rose-gold': '9k Rose Gold',
  }
  return metalMap[metal] || metal
}

// Helper function to format certificate names
const formatCertificate = (cert: string): string => {
  const certMap: Record<string, string> = {
    'jabour': 'Jabour Certificate',
    'idgl': 'IDGL',
    'igi': 'IGI',
  }
  return certMap[cert] || cert
}

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/my-account')
      } else {
        fetchOrder()
      }
    }
  }, [authLoading, user, params.id, router])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      
      // Verify that the order belongs to the current user
      if (data && data.user_id !== user?.id) {
        router.push('/my-account/orders')
        return
      }
      
      setOrder(data)
    } catch (error) {
      router.push('/my-account/orders')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user || !order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-16">
        <div className="max-w-5xl mx-auto">
          <Link href="/my-account/orders" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
            ← Back to Orders
          </Link>

          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-8">
            Order Details
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Order Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Order ID:</strong> <span className="font-mono">{order.id}</span></p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</p>
                <p><strong>Total:</strong> £{parseFloat(order.total_amount.toString()).toFixed(2)}</p>
                <p>
                  <strong>Status:</strong>{' '}
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
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Shipping Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                {order.customer_phone && (
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                )}
                <p className="mt-4"><strong>Address:</strong></p>
                <p className="text-gray-700 whitespace-pre-line">
                  {order.shipping_address || order.customer_address || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-primary-900 text-lg">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity || 1}</p>
                    </div>
                    <p className="font-semibold text-primary-900 text-lg">
                      £{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Display customizations if available */}
                  {item.customizations && (
                    <div className="mt-4 pl-4 border-l-2 border-gold-500">
                      <h4 className="text-sm font-semibold text-primary-900 mb-2">Configuration:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.customizations.metal && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Metal:</span> {formatMetal(item.customizations.metal)}
                          </p>
                        )}
                        {item.customizations.carat !== undefined && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Carat:</span> {item.customizations.carat}ct
                          </p>
                        )}
                        {item.customizations.color && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Colour:</span> {item.customizations.color}
                          </p>
                        )}
                        {item.customizations.clarity && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Clarity:</span> {item.customizations.clarity}
                          </p>
                        )}
                        {item.customizations.cut && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Cut:</span> {item.customizations.cut}
                          </p>
                        )}
                        {item.customizations.certificate && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Certificate:</span> {formatCertificate(item.customizations.certificate)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fallback to metal/diamondShape if customizations not available */}
                  {!item.customizations && (item.metal || item.diamondShape) && (
                    <div className="mt-4 pl-4 border-l-2 border-gold-500">
                      <h4 className="text-sm font-semibold text-primary-900 mb-2">Details:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.metal && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Metal:</span> {formatMetal(item.metal)}
                          </p>
                        )}
                        {item.diamondShape && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Shape:</span> {item.diamondShape}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xl font-semibold text-primary-900">Total</span>
              <span className="text-2xl font-bold text-primary-900">
                £{parseFloat(order.total_amount.toString()).toFixed(2)}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Order Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}















