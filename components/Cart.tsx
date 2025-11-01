'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaShoppingBag } from 'react-icons/fa'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  metal?: string
  diamondShape?: string
}

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    }
    
    loadCart()
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCart)
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])

  useEffect(() => {
    // Calculate total
    const calculatedTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(calculatedTotal)
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Shopping cart"
      >
        <FaShoppingBag className="text-lg" />
        {itemCount > 0 && (
          <>
            <span className="bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {itemCount}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              £{total.toLocaleString()}
            </span>
          </>
        )}
        {itemCount === 0 && (
          <>
            <span className="bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              0
            </span>
            <span className="text-sm font-semibold text-gray-900">
              £0.00
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-primary-900">
                Shopping Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Link href="/engagement-rings" className="btn-primary">
                    Shop Engagement Rings
                  </Link>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-primary-900">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {item.metal && (
                        <p className="text-sm text-gray-600 mb-1">Metal: {item.metal}</p>
                      )}
                      {item.diamondShape && (
                        <p className="text-sm text-gray-600 mb-1">Diamond: {item.diamondShape}</p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-primary-800">
                          £{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-semibold text-primary-900">Total</span>
                      <span className="text-2xl font-bold text-primary-800">
                        £{total.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      href="/checkout"
                      className="btn-primary w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
