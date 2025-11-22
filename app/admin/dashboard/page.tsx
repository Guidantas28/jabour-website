'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRequireAuth } from '@/lib/auth'
import { FaDollarSign, FaShoppingBag, FaCheckCircle, FaClock } from 'react-icons/fa'

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

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders()
    }
  }, [authLoading, user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setOrders(data || [])
      calculateStats(data || [])
    } catch (error) {
      alert(`Error loading orders: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersData: Order[]) => {
    const totalOrders = ordersData.length
    const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0)
    const pendingOrders = ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length
    const completedOrders = ordersData.filter(o => o.status === 'delivered').length

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      alert('Error updating order status')
    }
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
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href="/admin" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
                ← Back to Admin
              </Link>
              <h1 className="text-4xl font-serif font-bold text-primary-900">
                Sales Dashboard
              </h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-primary-900">{stats.totalOrders}</p>
                </div>
                <FaShoppingBag className="text-4xl text-gold-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary-900">£{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <FaDollarSign className="text-4xl text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-primary-900">{stats.pendingOrders}</p>
                </div>
                <FaClock className="text-4xl text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-primary-900">{stats.completedOrders}</p>
                </div>
                <FaCheckCircle className="text-4xl text-blue-500" />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-primary-900">
                Recent Orders
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Items</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                          {order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-semibold text-primary-900">{order.customer_name}</p>
                            <p className="text-gray-600">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {Array.isArray(order.items) ? order.items.length : 0} item(s)
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary-900">
                          £{parseFloat(order.total_amount.toString()).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs px-3 py-1 rounded-full font-semibold border-0 focus:ring-2 focus:ring-primary-800 ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.payment_status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-gold-500 hover:text-gold-600 text-sm font-semibold"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

