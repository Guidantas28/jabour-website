'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaSearch, FaTimes } from 'react-icons/fa'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
  base_price: number
  featured_image_url: string | null
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setProducts([])
      setHasSearched(false)
      return
    }

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim())
      } else if (searchQuery.trim().length === 0) {
        setProducts([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isOpen])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductClick = (product: Product) => {
    // Determine the correct route based on category
    let route = '/'
    if (product.category === 'engagement-rings') {
      route = `/engagement-rings/${product.slug}`
    } else if (product.category === 'wedding-rings') {
      // Wedding rings may not have individual product pages, link to category page
      route = `/wedding-rings`
    } else if (product.category === 'earrings') {
      route = `/jewellery/earrings`
    } else if (product.category === 'pendants') {
      route = `/jewellery/pendants`
    } else if (product.category === 'bracelets') {
      route = `/jewellery/bracelets`
    } else if (product.category === 'gemstones') {
      route = `/jewellery/gemstones`
    } else {
      // Default to engagement-rings route structure for unknown categories
      route = `/engagement-rings/${product.slug}`
    }
    
    onClose()
    router.push(route)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal */}
      <div
        className="relative min-h-screen flex items-start justify-center pt-16 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center border-b border-gray-200 px-4 py-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close search"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="px-4 py-8 text-center text-gray-500">
                Searching...
              </div>
            )}

            {!isLoading && hasSearched && searchQuery.trim().length >= 2 && (
              <>
                {products.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No products found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {products.length} {products.length === 1 ? 'result' : 'results'}
                    </div>
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-center space-x-4 border-b border-gray-100 last:border-b-0"
                      >
                        {product.featured_image_url && (
                          <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                            <Image
                              src={product.featured_image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {product.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1 uppercase">
                            {product.category.replace('-', ' ')}
                          </div>
                        </div>
                        {product.base_price > 0 && (
                          <div className="flex-shrink-0 text-sm font-semibold text-gray-900">
                            ${product.base_price.toLocaleString()}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {!isLoading && !hasSearched && searchQuery.trim().length < 2 && (
              <div className="px-4 py-8 text-center text-gray-500">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

