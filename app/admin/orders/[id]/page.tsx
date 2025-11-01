'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRequireAuth } from '@/lib/auth'

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrder()
    }
  }, [authLoading, user, params.id])

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
      alert('Error loading order')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (field: 'status' | 'payment_status', value: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', params.id)

      if (error) throw error
      fetchOrder()
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order')
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
          <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>

          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-8">
            Order Details
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Order Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Order ID:</strong> <span className="font-mono">{order.id}</span></p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString('en-GB')}</p>
                <p><strong>Total:</strong> £{parseFloat(order.total_amount.toString()).toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">Order Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-2">Payment Status</label>
                  <select
                    value={order.payment_status}
                    onChange={(e) => updateStatus('payment_status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Customer Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                {order.customer_phone && (
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Shipping Address</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {order.shipping_address || order.customer_address || 'N/A'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-4">
                  <div className="flex-1">
                    <p className="font-semibold text-primary-900">{item.name}</p>
                    {item.metal && (
                      <p className="text-sm text-gray-600">Metal: {item.metal}</p>
                    )}
                    {item.diamondShape && (
                      <p className="text-sm text-gray-600">Shape: {item.diamondShape}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                  </div>
                  <p className="font-semibold text-primary-900">
                    £{(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
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

