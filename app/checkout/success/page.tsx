'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Order Confirmed!
            </h1>

            {order && (
              <>
                <p className="text-lg text-gray-700 mb-6">
                  Thank you for your order. Your order number is:
                </p>
                <p className="text-2xl font-bold text-gold-500 mb-8">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h2 className="font-semibold text-primary-900 mb-4">Order Details:</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Total:</strong> £{parseFloat(order.total_amount.toString()).toFixed(2)}</p>
                    <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
                    <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <p className="text-gray-700 mb-6">
                We'll send you a confirmation email shortly. Our team will be in touch to confirm your order details.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/my-account/orders"
                  className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-sm font-semibold"
                >
                  View My Orders
                </Link>
                <Link
                  href="/engagement-rings"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-sm font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

