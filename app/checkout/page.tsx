'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { getCart, clearCart } from '@/lib/cart'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST || '')

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

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  metal?: string
  diamondShape?: string
  customizations?: {
    metal?: string
    carat?: number
    color?: string
    clarity?: string
    cut?: string
    certificate?: string
    bandStyle?: string
    ringSize?: string
    shape?: string
    diamond?: {
      carat?: number
      color?: string
      clarity?: string
      cut?: string
      lab?: string
    }
  }
}

// Payment Form Component
function PaymentForm({ 
  formData, 
  cart, 
  totalAmount, 
  onSuccess 
}: { 
  formData: any
  cart: CartItem[]
  totalAmount: number
  onSuccess: (orderId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Confirm payment with existing client secret
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.postcode,
                country: formData.country === 'United Kingdom' ? 'GB' : formData.country === 'United States' ? 'US' : 'GB',
              },
            },
          },
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        setProcessing(false)
        return
      }

      // Payment succeeded, create order in Supabase
      if (paymentIntent?.status === 'succeeded') {
        const shippingAddress = `${formData.address}, ${formData.city}, ${formData.postcode}, ${formData.country}`

        const orderData: any = {
          user_id: user?.id || null,
          customer_email: formData.email,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: shippingAddress,
          items: cart,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'paid',
          shipping_address: shippingAddress,
          notes: formData.notes,
        }

        // Add payment_intent_id if column exists
        if (paymentIntent?.id) {
          orderData.payment_intent_id = paymentIntent.id
        }

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single()

        if (orderError) {
          console.error('Supabase error:', orderError)
          throw orderError
        }

        // Clear cart
        clearCart()
        
        // Dispatch cart update event to update UI
        window.dispatchEvent(new Event('cartUpdated'))
        
        // Call success callback
        onSuccess(order.id)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'An error occurred during payment')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-sm font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay £${totalAmount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false)
  const [emailExists, setEmailExists] = useState<boolean | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [accountPassword, setAccountPassword] = useState('')
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  const [phoneCountryCode, setPhoneCountryCode] = useState('+44') // Default to UK
  const [phoneError, setPhoneError] = useState<string | null>(null)
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

  // Country codes with flags (emoji flags)
  const countryCodes = [
    { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
    { code: '+1', flag: '🇺🇸', country: 'United States' },
    { code: '+55', flag: '🇧🇷', country: 'Brazil' },
    { code: '+33', flag: '🇫🇷', country: 'France' },
    { code: '+49', flag: '🇩🇪', country: 'Germany' },
    { code: '+39', flag: '🇮🇹', country: 'Italy' },
    { code: '+34', flag: '🇪🇸', country: 'Spain' },
    { code: '+31', flag: '🇳🇱', country: 'Netherlands' },
    { code: '+32', flag: '🇧🇪', country: 'Belgium' },
    { code: '+41', flag: '🇨🇭', country: 'Switzerland' },
    { code: '+351', flag: '🇵🇹', country: 'Portugal' },
    { code: '+353', flag: '🇮🇪', country: 'Ireland' },
    { code: '+46', flag: '🇸🇪', country: 'Sweden' },
    { code: '+47', flag: '🇳🇴', country: 'Norway' },
    { code: '+45', flag: '🇩🇰', country: 'Denmark' },
    { code: '+358', flag: '🇫🇮', country: 'Finland' },
    { code: '+61', flag: '🇦🇺', country: 'Australia' },
    { code: '+64', flag: '🇳🇿', country: 'New Zealand' },
    { code: '+27', flag: '🇿🇦', country: 'South Africa' },
    { code: '+971', flag: '🇦🇪', country: 'United Arab Emirates' },
  ]

  // Update country code when country changes
  useEffect(() => {
    const countryMap: Record<string, string> = {
      'United Kingdom': '+44',
      'United States': '+1',
      'Brazil': '+55',
      'France': '+33',
      'Germany': '+49',
      'Italy': '+39',
      'Spain': '+34',
      'Netherlands': '+31',
      'Belgium': '+32',
      'Switzerland': '+41',
      'Portugal': '+351',
      'Ireland': '+353',
      'Sweden': '+46',
      'Norway': '+47',
      'Denmark': '+45',
      'Finland': '+358',
      'Australia': '+61',
      'New Zealand': '+64',
      'South Africa': '+27',
      'United Arab Emirates': '+971',
    }
    const code = countryMap[formData.country] || '+44'
    setPhoneCountryCode(code)
  }, [formData.country])

  // Phone validation
  const validatePhone = (phone: string, countryCode: string): boolean => {
    if (!phone) return false
    
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    
    // UK phone validation
    if (countryCode === '+44') {
      // UK numbers: +44 followed by 10 digits (without leading 0)
      const ukPattern = /^(\+44|0)?[1-9]\d{9}$/
      return ukPattern.test(cleanPhone)
    }
    
    // US phone validation
    if (countryCode === '+1') {
      // US numbers: 10 digits
      const usPattern = /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/
      return usPattern.test(cleanPhone)
    }
    
    // Brazil phone validation
    if (countryCode === '+55') {
      // Brazil numbers: 10 or 11 digits (with area code)
      const brPattern = /^(\+55)?[1-9]\d{8,9}$/
      return brPattern.test(cleanPhone)
    }
    
    // Generic validation: at least 7 digits
    const genericPattern = /^[\d\s\-\(\)]{7,15}$/
    return genericPattern.test(cleanPhone)
  }

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

    // Cleanup timeout on unmount
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current)
      }
    }
  }, [user])

  // Create payment intent when form is ready (only once)
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (cart.length === 0) return
      // Don't create a new payment intent if one already exists
      if (paymentIntentCreated || clientSecret) return

      const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

      try {
        setPaymentIntentCreated(true)
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'gbp',
          }),
        })

        const { clientSecret: secret } = await response.json()
        setClientSecret(secret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        setPaymentIntentCreated(false) // Reset on error so it can retry
      }
    }

    createPaymentIntent()
    // Only depend on cart length and total amount, not the entire cart array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length, paymentIntentCreated])

  // Debounce timer for email checking
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Check email when user types in email field (with debounce)
    if (name === 'email' && value && value.includes('@')) {
      // Clear previous timeout
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current)
      }

      // Set new timeout to check email after user stops typing
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailExists(value)
      }, 800) // Wait 800ms after user stops typing
    } else if (name === 'email' && !value) {
      // Reset states when email is cleared
      setEmailExists(null)
      setShowCreateAccount(false)
      setAccountPassword('')
      setAccountError(null)
    }
  }

  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return

    setCheckingEmail(true)
    setEmailExists(null)
    setShowCreateAccount(false)

    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const { exists } = await response.json()
      setEmailExists(exists)

      // If email doesn't exist and user is not logged in, show create account option
      if (!exists && !user) {
        setShowCreateAccount(true)
      }
    } catch (error) {
      console.error('Error checking email:', error)
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingAccount(true)
    setAccountError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: accountPassword,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Account created successfully
        setShowCreateAccount(false)
        setAccountPassword('')
        // Refresh to get the new user session
        router.refresh()
      }
    } catch (error: any) {
      setAccountError(error.message || 'Error creating account')
    } finally {
      setCreatingAccount(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingAccount(false)
    setAccountError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: accountPassword,
      })

      if (error) throw error

      if (data.user) {
        // Login successful
        setShowCreateAccount(false)
        setAccountPassword('')
        router.refresh()
      }
    } catch (error: any) {
      setAccountError(error.message || 'Error logging in')
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handlePaymentSuccess = (orderId: string) => {
    router.push(`/checkout/success?id=${orderId}`)
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
              <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
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
                    <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                    />
                      {checkingEmail && (
                        <div className="absolute right-3 top-2.5">
                          <div className="h-4 w-4 border-2 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {emailExists === false && !user && formData.email && formData.email.includes('@') && (
                      <div className="mt-2 text-sm text-blue-600">
                        This email doesn't have an account. Create one below to track your orders.
                      </div>
                    )}
                    {emailExists === true && !user && formData.email && formData.email.includes('@') && (
                      <div className="mt-2 text-sm text-green-600">
                        This email has an account. You can log in below.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-primary-900 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => {
                          setPhoneCountryCode(e.target.value)
                          // Re-validate phone when country code changes
                          if (formData.phone) {
                            const isValid = validatePhone(formData.phone, e.target.value)
                            setPhoneError(isValid ? null : 'Please enter a valid phone number')
                          }
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-primary-800 focus:border-primary-800 appearance-none bg-white"
                        style={{ minWidth: '100px' }}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {/* Phone Input */}
                    <div className="flex-1">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`w-full border rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800 ${
                          phoneError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                      )}
                    </div>
                  </div>
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

                {/* Account Creation/Login Section */}
                {!user && formData.email && formData.email.includes('@') && (emailExists === false || emailExists === true) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-4">
                    {emailExists === false ? (
                      <>
                        <p className="text-sm text-blue-800 font-semibold">
                          Create an account to track your orders
                        </p>
                        {showCreateAccount ? (
                          <form onSubmit={handleCreateAccount} className="space-y-3">
                            <div>
                              <label htmlFor="accountPassword" className="block text-sm font-semibold text-primary-900 mb-2">
                                Create Password *
                              </label>
                              <input
                                type="password"
                                id="accountPassword"
                                value={accountPassword}
                                onChange={(e) => setAccountPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                                placeholder="Minimum 6 characters"
                              />
                            </div>
                            {accountError && (
                              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                                <p className="text-sm text-red-800">{accountError}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={creatingAccount}
                                className="flex-1 bg-primary-900 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                              >
                                {creatingAccount ? 'Creating...' : 'Create Account'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowCreateAccount(false)
                                  setAccountPassword('')
                                  setAccountError(null)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setShowCreateAccount(true)}
                            className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded transition-colors"
                          >
                            Create Account
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-blue-800 font-semibold">
                          You have an account. Log in to track your orders
                        </p>
                        <form onSubmit={handleLogin} className="space-y-3">
                          <div>
                            <label htmlFor="loginPassword" className="block text-sm font-semibold text-primary-900 mb-2">
                              Password *
                            </label>
                            <input
                              type="password"
                              id="loginPassword"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              required
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                            />
                          </div>
                          {accountError && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-2">
                              <p className="text-sm text-red-800">{accountError}</p>
                            </div>
                          )}
                          <button
                            type="submit"
                            className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-2 px-4 rounded transition-colors"
                          >
                            Log In
                          </button>
                        </form>
                        <p className="text-xs text-gray-600 text-center">
                          Or <Link href="/my-account" className="text-primary-900 hover:underline font-semibold">continue as guest</Link>
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Payment Section */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
                    Payment Information
                  </h2>
                  {clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                        },
                      }}
                    >
                      <PaymentForm
                        formData={formData}
                        cart={cart}
                        totalAmount={calculateTotal()}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm text-gray-600">Loading payment form...</p>
                    </div>
                  )}
                </div>
              </div>
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
                        <p className="font-semibold text-primary-900 mb-2">{item.name}</p>
                        {item.customizations ? (
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.customizations.metal && (
                              <p>Metal: {formatMetal(item.customizations.metal)}</p>
                            )}
                            {item.customizations.bandStyle && (
                              <p>Band Style: {item.customizations.bandStyle}</p>
                            )}
                            {item.customizations.ringSize && (
                              <p>Ring Size: {item.customizations.ringSize}</p>
                            )}
                            {item.customizations.shape && (
                              <p>Diamond Shape: {item.customizations.shape}</p>
                            )}
                            {/* Diamond information from Nivoda */}
                            {item.customizations.diamond && (
                              <>
                                {item.customizations.diamond.carat && (
                                  <p>Diamond Carat: {item.customizations.diamond.carat.toFixed(2)}ct</p>
                                )}
                                {item.customizations.diamond.color && (
                                  <p>Diamond Colour: {item.customizations.diamond.color}</p>
                                )}
                                {item.customizations.diamond.clarity && (
                                  <p>Diamond Clarity: {item.customizations.diamond.clarity}</p>
                                )}
                                {item.customizations.diamond.cut && (
                                  <p>Diamond Cut: {item.customizations.diamond.cut}</p>
                                )}
                                {item.customizations.diamond.lab && (
                                  <p>Diamond Certificate: {item.customizations.diamond.lab}</p>
                                )}
                              </>
                            )}
                            {/* Fallback for old format */}
                            {!item.customizations.diamond && item.customizations.carat && (
                              <p>Carat: {item.customizations.carat.toFixed(2)}ct</p>
                            )}
                            {!item.customizations.diamond && item.customizations.color && (
                              <p>Colour: {item.customizations.color}</p>
                            )}
                            {!item.customizations.diamond && item.customizations.clarity && (
                              <p>Clarity: {item.customizations.clarity}</p>
                            )}
                            {!item.customizations.diamond && item.customizations.cut && (
                              <p>Cut: {item.customizations.cut}</p>
                            )}
                            {!item.customizations.diamond && item.customizations.certificate && (
                              <p>Certificate: {formatCertificate(item.customizations.certificate)}</p>
                            )}
                            <p className="mt-2">Quantity: {item.quantity}</p>
                          </div>
                        ) : (
                          <>
                            {item.metal && (
                              <p className="text-sm text-gray-600">Metal: {item.metal}</p>
                            )}
                            {item.diamondShape && (
                              <p className="text-sm text-gray-600">Shape: {item.diamondShape}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </>
                        )}
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
                      £{calculateTotal().toFixed(2)}
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
