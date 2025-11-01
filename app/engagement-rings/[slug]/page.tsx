'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/cart'

interface ProductPageProps {
  params: {
    slug: string
  }
}

const products: Record<string, {
  name: string
  description: string
  price: string
  metals: string[]
  diamondShapes: string[]
  images: string[]
}> = {
  'classic-solitaire': {
    name: 'Classic Solitaire',
    description: 'A timeless classic engagement ring featuring a single brilliant diamond set in a simple, elegant band. Perfect for those who appreciate understated elegance.',
    price: 'From £995',
    metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
    diamondShapes: ['Round', 'Oval', 'Princess', 'Emerald', 'Cushion'],
    images: ['/rings/solitaire-1.jpg', '/rings/solitaire-2.jpg'],
  },
  'elegant-halo': {
    name: 'Elegant Halo',
    description: 'A stunning halo engagement ring with a central diamond surrounded by a delicate halo of smaller diamonds, creating maximum sparkle and brilliance.',
    price: 'From £1,550',
    metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
    diamondShapes: ['Round', 'Oval', 'Cushion'],
    images: ['/rings/halo-1.jpg', '/rings/halo-2.jpg'],
  },
  'timeless-trilogy': {
    name: 'Timeless Trilogy',
    description: 'A beautiful three-stone engagement ring representing your past, present, and future together. The central diamond is flanked by two smaller stones.',
    price: 'From £1,575',
    metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
    diamondShapes: ['Round', 'Oval', 'Princess'],
    images: ['/rings/trilogy-1.jpg', '/rings/trilogy-2.jpg'],
  },
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const product = products[params.slug]
  const [selectedMetal, setSelectedMetal] = useState<string>('')
  const [selectedShape, setSelectedShape] = useState<string>('')
  const [showMessage, setShowMessage] = useState(false)

  if (!product) {
    notFound()
  }

  // Extract numeric price from "From £995" format
  const priceMatch = product.price.match(/£([0-9,]+)/)
  const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 995

  const handleAddToCart = () => {
    if (!selectedMetal || !selectedShape) {
      alert('Please select a metal and diamond shape')
      return
    }

    addToCart({
      id: `${params.slug}-${selectedMetal}-${selectedShape}`,
      name: product.name,
      price,
      metal: selectedMetal,
      diamondShape: selectedShape,
    })

    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 3000)
    
    // Trigger cart update (you could use a context/state management solution here)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleBookAppointment = () => {
    router.push('/book-appointment')
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom section-padding">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-800">Home</Link>
          {' / '}
          <Link href="/engagement-rings" className="hover:text-primary-800">Engagement Rings</Link>
          {' / '}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-primary-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-primary-800 mb-6">
              {product.price}
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Metal Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Metal</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.metals.map((metal) => (
                  <button
                    key={metal}
                    onClick={() => setSelectedMetal(metal)}
                    className={`border-2 rounded-md px-4 py-3 text-left transition-colors ${
                      selectedMetal === metal
                        ? 'border-primary-800 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-800'
                    }`}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Diamond Shape Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Diamond Shape</h3>
              <div className="grid grid-cols-3 gap-4">
                {product.diamondShapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`border-2 rounded-md px-4 py-3 text-center transition-colors ${
                      selectedShape === shape
                        ? 'border-primary-800 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-800'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-8">
              {showMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                  Item added to cart!
                </div>
              )}
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full text-lg py-4"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBookAppointment}
                className="btn-secondary w-full text-lg py-4"
              >
                Book Appointment to Customise
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold mb-4">What's Included</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lifetime Warranty
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free Ring Resizing
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Certified Diamonds
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-800 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  40 Day Returns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
