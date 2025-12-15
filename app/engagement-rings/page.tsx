'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function EngagementRingsContent() {
  const searchParams = useSearchParams()
  const [rings, setRings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedMetal, setSelectedMetal] = useState('')
  const [selectedShape, setSelectedShape] = useState('')
  const [recommending, setRecommending] = useState(false)
  const [recommendation, setRecommendation] = useState<{
    shape: string
    shapeName: string
    explanation: string
  } | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // GSAP animations
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Hero section animations
      if (heroTitleRef.current && heroSubtitleRef.current) {
        gsap.from(heroTitleRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        })
        
        gsap.from(heroSubtitleRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
        })
      }

      // Filters section
      if (filtersRef.current) {
        gsap.from(filtersRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Products grid
      if (productsRef.current && !loading && rings.length > 0) {
        const productCards = productsRef.current.querySelectorAll('.product-card')
        gsap.from(productCards, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }

      // CTA section
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    return () => ctx.revert()
  }, [rings, loading])

  useEffect(() => {
    // Read query parameters from URL
    const style = searchParams?.get('style') || ''
    const metal = searchParams?.get('metal') || ''
    const shape = searchParams?.get('shape') || ''
    const category = searchParams?.get('category') || ''
    const stone = searchParams?.get('stone') || ''

    setSelectedStyle(style)
    setSelectedMetal(metal)
    setSelectedShape(shape)

    fetchProducts(style, metal, shape, category, stone)
  }, [searchParams])

  const fetchProducts = async (style: string, metal: string, shape: string, category: string, stone: string) => {
    try {
      // Fetch products from API
      const response = await fetch(`/api/products?category=engagement-rings`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      const products = data.products || []

      // Filter out products without slugs - CRITICAL: We need slugs for routing
      // Also ensure we only have unique products by slug
      const slugMap = new Map<string, any>()
      products.forEach((p: any) => {
        if (!p.slug) {
          return
        }
        if (slugMap.has(p.slug)) {
          return
        }
        slugMap.set(p.slug, p)
      })
      
      const validProducts = Array.from(slugMap.values())

      // Process products to extract metals and shapes from configurations
      let processedProducts = validProducts.map((p: any) => {
        // Get metals from product_configurations
        const metals = p.product_configurations
          ?.filter((c: any) => c.configuration_type === 'metal' && c.active)
          .sort((a: any, b: any) => {
            // Prioritize 18k metals first
            const aIs18k = a.configuration_value?.includes('18k') || a.display_name?.includes('18k')
            const bIs18k = b.configuration_value?.includes('18k') || b.display_name?.includes('18k')
            
            if (aIs18k && !bIs18k) return -1
            if (!aIs18k && bIs18k) return 1
            
            // If both are same type (both 18k or both 9k), sort by display_order
            return a.display_order - b.display_order
          })
          .map((c: any) => c.display_name) || []

        // Get shapes from product_configurations
        const shapes = p.product_configurations
          ?.filter((c: any) => c.configuration_type === 'shape' && c.active)
          .map((c: any) => c.display_name) || []

        // Format price
        const price = p.base_price 
          ? `From £${p.base_price.toLocaleString()}` 
          : 'Price on request'

        // CRITICAL: Always use slug, never ID for routing
        const slug = p.slug // Never fallback to ID
        if (!slug) {
        }

        return {
          id: slug, // Use slug for routing (this becomes the URL)
          slug: slug, // Also keep slug explicitly
          name: p.name,
          price,
          metals,
          shapes,
          image: p.featured_image_url,
          product: p, // Keep full product for filtering
        }
      })

      // Apply filters
      if (style) {
        processedProducts = processedProducts.filter((p: any) => {
          const name = (p.name || '').toLowerCase()
          const styleLower = style.toLowerCase()
          return name.includes(styleLower)
        })
      }

      if (metal) {
        const metalMap: Record<string, string> = {
          'white-gold': 'White Gold',
          'yellow-gold': 'Yellow Gold',
          'rose-gold': 'Rose Gold',
        }
        const metalName = metalMap[metal] || metal
        processedProducts = processedProducts.filter((p: any) => {
          return p.metals.some((m: string) => 
            m.toLowerCase().includes(metalName.toLowerCase()) ||
            metalName.toLowerCase().includes(m.toLowerCase())
          )
        })
      }

      if (shape) {
        processedProducts = processedProducts.filter((p: any) => {
          return p.shapes.some((s: string) => 
            s.toLowerCase() === shape.toLowerCase()
          ) || p.name.toLowerCase().includes(shape.toLowerCase())
        })
      }

      if (category) {
        processedProducts = processedProducts.filter((p: any) => {
          const pCategory = (p.product?.subcategory || '').toLowerCase()
          return pCategory === category.toLowerCase()
        })
      }

      // Remove duplicates by slug - CRITICAL: Use slug as unique identifier
      const uniqueProductsMap = new Map<string, any>()
      processedProducts.forEach((p: any) => {
        if (p.slug && !uniqueProductsMap.has(p.slug)) {
          uniqueProductsMap.set(p.slug, p)
        } else if (p.slug && uniqueProductsMap.has(p.slug)) {
        }
      })
      const uniqueProducts = Array.from(uniqueProductsMap.values())

      const ringsToSet = uniqueProducts.map((p: any) => {
        // CRITICAL: Always use slug, never ID
        const slug = p.slug
        if (!slug) {
          return null
        }
        return {
          id: slug, // Use slug as id for React key
          slug: slug, // Explicitly store slug for href
          name: p.name,
          price: p.price,
          metals: p.metals,
          image: p.image,
        }
      }).filter(Boolean) // Remove any null entries
      
      setRings(ringsToSet)
    } catch (error) {
      // Show empty state instead of fallback data
      setRings([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }

    // Navigate with new params
    window.location.href = `/engagement-rings?${params.toString()}`
  }

  const handleRandomRecommendation = async () => {
    setRecommending(true)
    setRecommendation(null)
    
    try {
      const response = await fetch('/api/recommend-diamond-shape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: {
            style: selectedStyle,
            metal: selectedMetal,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendation')
      }

      const data = await response.json()
      setRecommendation({
        shape: data.shape,
        shapeName: data.shapeName,
        explanation: data.explanation,
      })

      // Update the shape filter with the recommended shape
      handleFilterChange('shape', data.shape)
    } catch (error) {
      // Show error message to user
      alert('Unable to get a recommendation. Please try again.')
    } finally {
      setRecommending(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 ref={heroTitleRef} className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Engagement Rings
          </h1>
          <p ref={heroSubtitleRef} className="text-xl text-gray-600 max-w-3xl">
            Discover our exquisite collection of bespoke engagement rings, crafted with precision
            and care in our Hatton Garden workshop.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section ref={filtersRef} className="bg-white border-b border-gray-200 py-6">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4">
            <select 
              className="border border-gray-300 rounded-md px-4 py-2"
              value={selectedStyle}
              onChange={(e) => handleFilterChange('style', e.target.value)}
            >
              <option value="">All Styles</option>
              <option value="solitaire">Solitaire</option>
              <option value="halo">Halo</option>
              <option value="trilogy">Trilogy</option>
              <option value="side-stone">Side Stone</option>
              <option value="cluster">Cluster</option>
              <option value="vintage">Vintage</option>
            </select>
            <select 
              className="border border-gray-300 rounded-md px-4 py-2"
              value={selectedMetal}
              onChange={(e) => handleFilterChange('metal', e.target.value)}
            >
              <option value="">All Metals</option>
              <option value="white-gold">White Gold</option>
              <option value="yellow-gold">Yellow Gold</option>
              <option value="rose-gold">Rose Gold</option>
            </select>
            <div className="flex gap-2 items-center">
              <select 
                className="border border-gray-300 rounded-md px-4 py-2"
                value={selectedShape}
                onChange={(e) => handleFilterChange('shape', e.target.value)}
              >
                <option value="">All Diamond Shapes</option>
                <option value="round">Round</option>
                <option value="oval">Oval</option>
                <option value="princess">Princess</option>
                <option value="emerald">Emerald</option>
                <option value="cushion">Cushion</option>
                <option value="marquise">Marquise</option>
                <option value="pear">Pear</option>
                <option value="baguette">Baguette</option>
              </select>
              <button
                onClick={handleRandomRecommendation}
                disabled={recommending}
                className="px-4 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                title="Not sure which shape to choose? Let our AI recommend one for you!"
              >
                {recommending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Choose for me</span>
                  </>
                )}
              </button>
            </div>
            {recommendation && (
              <div className="w-full mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary-900 mb-1">
                      Recommendation: {recommendation.shapeName}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {recommendation.explanation}
                    </p>
                  </div>
                  <button
                    onClick={() => setRecommendation(null)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    aria-label="Close recommendation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : rings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found matching your filters.</p>
              <Link href="/engagement-rings" className="text-primary-900 hover:text-gold-500 mt-4 inline-block">
                Clear filters
              </Link>
            </div>
          ) : (
            <div ref={productsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rings.map((ring) => {
                // CRITICAL: Always use slug, never ID
                if (!ring.slug) {
                  return null
                }
                const slug = ring.slug
                return (
              <Link
                key={slug}
                href={`/engagement-rings/${slug}`}
                className="product-card group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="h-80 bg-gray-100 relative overflow-hidden">
                  {ring.image ? (
                    ring.image.endsWith('.avif') ? (
                      <img
                        src={ring.image}
                        alt={ring.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                    <Image
                      src={ring.image}
                      alt={ring.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                        quality={100}
                        sizes="(max-width: 768px) 50vw, 33vw"
                      unoptimized={ring.image.includes('supabase.co')}
                    />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-primary-800 rounded-full group-hover:scale-110 transition-transform"></div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <button className="bg-white rounded-full p-2 shadow-md hover:bg-primary-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">
                    {ring.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Available in: {ring.metals.slice(0, 2).join(', ')}
                    {ring.metals.length > 2 && ' + more'}
                  </p>
                  <p className="text-lg font-semibold text-primary-800 mb-4">{ring.price}</p>
                  <button className="btn-secondary w-full">View Details</button>
                </div>
              </Link>
              )
              }).filter(Boolean)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Book a free consultation with our experts to create a bespoke engagement ring.
          </p>
          <Link href="/book-appointment" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function EngagementRingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <EngagementRingsContent />
    </Suspense>
  )
}
