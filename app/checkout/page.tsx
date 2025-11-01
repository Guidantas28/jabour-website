'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCart, clearCart } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  metal?: string
  diamondShape?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    notes: '',
  })

  useEffect(() => {
    const cartItems = getCart()
    setCart(cartItems)

    // Pre-fill form if user is logged in
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: user.user_metadata?.full_name || '',
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (cart.length === 0) {
        alert('Your cart is empty')
        return
      }

      const totalAmount = calculateTotal()
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.postcode}, ${formData.country}`

      // Create order in Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id || null,
          customer_email: formData.email,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: shippingAddress,
          items: cart,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          shipping_address: shippingAddress,
          notes: formData.notes,
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Clear cart
      clearCart()
      
      // Redirect to order confirmation
      router.push(`/checkout/success?id=${order.id}`)
    } catch (error: any) {
      console.error('Error placing order:', error)
      alert(`Error placing order: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom section-padding py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Your cart is empty
            </h1>
            <Link
              href="/engagement-rings"
              className="text-gold-500 hover:text-gold-600 font-semibold"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-8">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-primary-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-primary-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-primary-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-primary-900 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-primary-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="postcode" className="block text-sm font-semibold text-primary-900 mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-primary-900 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-primary-900 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    placeholder="Special instructions or requests..."
                  />
                </div>

                {!user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-sm text-blue-800">
                      <Link href="/my-account" className="font-semibold hover:underline">
                        Create an account
                      </Link> to track your orders and save your information.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-sm font-semibold text-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-gray-200 pb-4">
                      <div className="flex-1">
                        <p className="font-semibold text-primary-900">{item.name}</p>
                        {item.metal && (
                          <p className="text-sm text-gray-600">Metal: {item.metal}</p>
                        )}
                        {item.diamondShape && (
                          <p className="text-sm text-gray-600">Shape: {item.diamondShape}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary-900 ml-4">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-primary-900">Total</span>
                    <span className="text-2xl font-bold text-primary-900">
                      £{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
