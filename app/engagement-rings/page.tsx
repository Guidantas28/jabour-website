'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function EngagementRingsContent() {
  const searchParams = useSearchParams()
  const [rings, setRings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedMetal, setSelectedMetal] = useState('')
  const [selectedShape, setSelectedShape] = useState('')

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
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'engagement-rings')
        .order('created_at', { ascending: false })

      // Apply filters if they exist
      // Note: This assumes the database has these columns or we filter in memory
      
      const { data: products } = await query

      // Filter products in memory based on query parameters
      let filteredProducts = products || []

      if (style) {
        // Filter by style - assuming style is in the product name or a style field
        filteredProducts = filteredProducts.filter((p: any) => {
          const name = (p.name || '').toLowerCase()
          const styleLower = style.toLowerCase()
          return name.includes(styleLower) || (p.style && p.style.toLowerCase() === styleLower)
        })
      }

      if (metal) {
        // Filter by metal
        filteredProducts = filteredProducts.filter((p: any) => {
          const metals = Array.isArray(p.metals) ? p.metals : []
          const metalMap: Record<string, string> = {
            'platinum': 'Platinum',
            'white-gold': '18k White Gold',
            'yellow-gold': '18k Yellow Gold',
            'rose-gold': '18k Rose Gold',
            'silver': 'Silver',
            'mixed-metal': 'Mixed Metal'
          }
          const metalName = metalMap[metal] || metal
          return metals.some((m: string) => 
            m.toLowerCase().includes(metalName.toLowerCase()) ||
            metalName.toLowerCase().includes(m.toLowerCase())
          )
        })
      }

      if (shape) {
        // Filter by diamond shape
        filteredProducts = filteredProducts.filter((p: any) => {
          const shapes = Array.isArray(p.diamond_shapes) ? p.diamond_shapes : []
          const name = (p.name || '').toLowerCase()
          // Check if shape is in the diamond_shapes array or in the product name
          return shapes.some((s: string) => 
            s.toLowerCase() === shape.toLowerCase()
          ) || name.includes(shape.toLowerCase())
        })
      }

      if (category) {
        // Filter by category (womens, mens, bespoke, gemstone)
        filteredProducts = filteredProducts.filter((p: any) => {
          const pCategory = (p.subcategory || '').toLowerCase()
          return pCategory === category.toLowerCase()
        })
      }

      // If no products from database, use static data
      if (filteredProducts.length === 0 && (!products || products.length === 0)) {
        // Apply filters to static data
        let staticRings: any[] = [
          {
            id: 'portman',
            name: 'Portman Engagement Ring',
            price: 'From £1,200',
            metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
            image: '/images/rings/portman/portman-round.avif',
            diamond_shapes: ['Round', 'Oval'],
            style: 'solitaire',
          },
          {
            id: 'bardot',
            name: 'Bardot Engagement Ring',
            price: 'From £995',
            metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
            image: '/images/rings/bardot/bardot-round-platinum2.avif',
            diamond_shapes: ['Round', 'Oval', 'Pear', 'Heart', 'Cushion', 'Emerald', 'Asscher', 'Radiant', 'Princess'],
            style: 'solitaire',
          },
          {
            id: 'marquise-trilogy',
            name: 'Marquise Solitaire',
            price: 'From £1,200',
            metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
            image: 'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise_1.jpg',
            diamond_shapes: ['Marquise'],
            style: 'solitaire',
          },
        ]

        // Apply shape filter to static data if needed
        if (shape) {
          staticRings = staticRings.filter((ring) => {
            const shapes = Array.isArray(ring.diamond_shapes) ? ring.diamond_shapes : []
            const name = (ring.name || '').toLowerCase()
            return shapes.some((s: string) => 
              s.toLowerCase() === shape.toLowerCase()
            ) || name.includes(shape.toLowerCase())
          })
        }

        // Apply style filter to static data if needed
        if (style) {
          staticRings = staticRings.filter((ring) => {
            const ringStyle = (ring.style || '').toLowerCase()
            return ringStyle === style.toLowerCase()
          })
        }

        // Apply metal filter to static data if needed
        if (metal) {
          const metalMap: Record<string, string> = {
            'platinum': 'Platinum',
            'white-gold': 'White Gold',
            'yellow-gold': 'Yellow Gold',
            'rose-gold': 'Rose Gold',
            'silver': 'Silver',
            'mixed-metal': 'Mixed Metal'
          }
          const metalName = metalMap[metal] || metal
          staticRings = staticRings.filter((ring) => {
            const metals = Array.isArray(ring.metals) ? ring.metals : []
            return metals.some((m: string) => 
              m.toLowerCase().includes(metalName.toLowerCase()) ||
              metalName.toLowerCase().includes(m.toLowerCase())
            )
          })
        }

        setRings(staticRings.map((ring) => ({
          id: ring.id,
          name: ring.name,
          price: ring.price,
          metals: Array.isArray(ring.metals) ? ring.metals : [],
          image: ring.image,
        })))
      } else if (filteredProducts.length > 0) {
        setRings(filteredProducts.map((p: any) => ({
          id: p.slug,
          name: p.name,
          price: p.price,
          metals: Array.isArray(p.metals) ? p.metals : [],
          image: p.featured_image_url,
        })))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to static data on error - show all 3 products
      setRings([
        {
          id: 'portman',
          name: 'Portman Engagement Ring',
          price: 'From £1,200',
          metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
          image: '/images/rings/portman/portman-round.avif',
          diamond_shapes: ['Round', 'Oval'],
          style: 'solitaire',
        },
        {
          id: 'bardot',
          name: 'Bardot Engagement Ring',
          price: 'From £995',
          metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
          image: '/images/rings/bardot/bardot-round-platinum1.avif',
          diamond_shapes: ['Round', 'Oval', 'Pear', 'Heart', 'Cushion', 'Emerald', 'Asscher', 'Radiant', 'Princess'],
          style: 'solitaire',
        },
        {
          id: 'marquise-trilogy',
          name: 'Marquise Solitaire',
          price: 'From £1,200',
          metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
          image: 'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise_1.jpg',
          diamond_shapes: ['Marquise'],
          style: 'solitaire',
        },
      ])
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Engagement Rings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover our exquisite collection of bespoke engagement rings, crafted with precision
            and care in our Hatton Garden workshop.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
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
              <option value="platinum">Platinum</option>
              <option value="white-gold">White Gold</option>
              <option value="yellow-gold">Yellow Gold</option>
              <option value="rose-gold">Rose Gold</option>
              <option value="silver">Silver</option>
            </select>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rings.map((ring) => (
              <Link
                key={ring.id}
                href={ring.id === 'marquise-trilogy' ? '/engagement-rings/marquise-trilogy' : `/engagement-rings/${ring.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
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
