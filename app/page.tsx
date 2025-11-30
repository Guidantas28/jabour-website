'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  FaHammer, 
  FaLeaf, 
  FaCertificate, 
  FaShieldAlt, 
  FaRulerCombined, 
  FaUndo,
  FaGem
} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import FAQ from '@/components/FAQ'
import GoogleReviews from '@/components/GoogleReviews'

export default function Home() {
  const [rings, setRings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  // Scroll animations with Intersection Observer
  useEffect(() => {
    // Wait for DOM to be ready
    const setupObserver = () => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, observerOptions)

      // Observe all elements with scroll animation classes
      const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-scale-in')
      animatedElements.forEach((el) => observer.observe(el))

      return () => {
        animatedElements.forEach((el) => observer.unobserve(el))
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObserver, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [rings, loading])

  const fetchProducts = async () => {
    try {
      // Fetch products from API (same as engagement-rings page)
      const response = await fetch(`/api/products?category=engagement-rings`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      const products = data.products || []

      // Filter out products without slugs and remove duplicates by slug
      const slugMap = new Map<string, any>()
      products.forEach((p: any) => {
        if (!p.slug || p.slug.trim() === '') {
          return
        }
        if (slugMap.has(p.slug)) {
          return
        }
        slugMap.set(p.slug, p)
      })
      
      const validProducts = Array.from(slugMap.values())

      // Process products to extract metals and format price
      const processedRings = validProducts.slice(0, 3).map((p: any) => {
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

        // Format price
        const price = p.base_price 
          ? `From £${p.base_price.toLocaleString()}` 
          : 'Price on request'

        return {
          id: p.slug, // Use slug as id
          slug: p.slug, // Keep slug explicitly
          name: p.name,
          price,
          metals,
          image: p.featured_image_url,
        }
      })

      setRings(processedRings)
      setLoading(false)
    } catch (error) {
      // Show empty state instead of fallback data
      setRings([])
      setLoading(false)
    }
  }
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/images/hero/videohero.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="fade-in-up text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-wide" style={{ animationDelay: '0.2s' }}>
              Timeless Elegance<br />
              <span className="font-normal">Find Your Sparkle</span>
            </h1>
            <p className="fade-in-up text-base md:text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light" style={{ animationDelay: '0.4s' }}>
              Discover jewellery that captures light, beauty, and emotion,<br />
              timeless pieces to treasure forever.
            </p>
            <div className="fade-in-up flex flex-col sm:flex-row gap-3 justify-center items-center" style={{ animationDelay: '0.6s' }}>
              <Link href="/engagement-rings" className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-sm font-light text-sm uppercase tracking-wider transition-colors min-w-[200px]">
                Shop Engagement Rings
              </Link>
              <Link href="/book-appointment" className="bg-transparent border border-white/50 text-white px-6 py-3 rounded-sm font-light text-sm uppercase tracking-wider hover:bg-white/10 transition-colors min-w-[200px]">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
            <div className="scroll-fade-in flex flex-col items-center">
              <FaHammer className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Crafted In London</h3>
            </div>
            <div className="scroll-fade-in flex flex-col items-center" style={{ transitionDelay: '0.1s' }}>
              <FaLeaf className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Ethical Sourcing</h3>
            </div>
            <div className="scroll-fade-in flex flex-col items-center" style={{ transitionDelay: '0.2s' }}>
              <FaCertificate className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Certified Diamonds</h3>
            </div>
            <div className="scroll-fade-in flex flex-col items-center" style={{ transitionDelay: '0.3s' }}>
              <FaShieldAlt className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Lifetime Warranty</h3>
            </div>
            <div className="scroll-fade-in flex flex-col items-center" style={{ transitionDelay: '0.4s' }}>
              <FaRulerCombined className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Free Resizing</h3>
            </div>
            <div className="scroll-fade-in flex flex-col items-center" style={{ transitionDelay: '0.5s' }}>
              <FaUndo className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">40 Days Returns</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12 scroll-fade-in">
            <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Start creating your ring
            </h2>
            <p className="text-lg text-gray-600">
              You're three simple steps away from creating the perfect ring.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="scroll-scale-in text-center">
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Ring Designs</h3>
              <p className="text-gray-600">
                Browse our collection of exquisite engagement rings and find your perfect style.
              </p>
            </div>
            <div className="scroll-scale-in text-center" style={{ transitionDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book your appointment</h3>
              <p className="text-gray-600">
                Our experts are on hand to guide you through the options.
              </p>
            </div>
            <div className="scroll-scale-in text-center" style={{ transitionDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Perfect Ring</h3>
              <p className="text-gray-600">
                Work with our master craftsmen to bring your vision to life.
              </p>
            </div>
          </div>
          <div className="text-center mt-12 scroll-fade-in">
            <Link href="/engagement-rings" className="btn-primary">
              Explore Ring Designs
            </Link>
          </div>
        </div>
      </section>

      {/* Explore The Range Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-6 tracking-wide">
              EXPLORE THE RANGE
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-gray-300 flex-1 max-w-32"></div>
              <FaGem className="text-gold-500 text-xl" />
              <div className="h-px bg-gray-300 flex-1 max-w-32"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Engagement Rings */}
            <Link
              href="/engagement-rings"
              className="scroll-scale-in group flex flex-col"
            >
              <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/images/rings/engajament_ring.jpg"
                  alt="Engagement Rings"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={90}
                />
              </div>
              <h3 className="text-lg font-serif font-normal text-primary-900 mb-2 text-center uppercase tracking-wide">
                ENGAGEMENT RINGS
              </h3>
              <p className="text-primary-900 font-light text-center">
                From £299
              </p>
            </Link>

            {/* Diamond Rings */}
            <Link
              href="/diamonds"
              className="scroll-scale-in group flex flex-col"
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/images/rings/diamond_ring.jpg"
                  alt="Diamond Rings"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={90}
                />
              </div>
              <h3 className="text-lg font-serif font-normal text-primary-900 mb-2 text-center uppercase tracking-wide">
                DIAMOND RINGS
              </h3>
              <p className="text-primary-900 font-light text-center">
                From £299
              </p>
            </Link>

            {/* Wedding Rings */}
            <Link
              href="/wedding-rings"
              className="scroll-scale-in group flex flex-col"
              style={{ transitionDelay: '0.2s' }}
            >
              <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/images/rings/weeding_rings.jpg"
                  alt="Wedding Rings"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={90}
                />
              </div>
              <h3 className="text-lg font-serif font-normal text-primary-900 mb-2 text-center uppercase tracking-wide">
                WEDDING RINGS
              </h3>
              <p className="text-primary-900 font-light text-center">
                From £199
              </p>
            </Link>

            {/* Eternity Rings */}
            <Link
              href="/eternity-rings"
              className="scroll-scale-in group flex flex-col"
              style={{ transitionDelay: '0.3s' }}
            >
              <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/images/rings/eternity_rings.jpg"
                  alt="Eternity Rings"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={90}
                />
              </div>
              <h3 className="text-lg font-serif font-normal text-primary-900 mb-2 text-center uppercase tracking-wide">
                ETERNITY RINGS
              </h3>
              <p className="text-primary-900 font-light text-center">
                From £299
              </p>
            </Link>

            {/* Earrings */}
            <Link
              href="/jewellery/earrings"
              className="scroll-scale-in group flex flex-col"
              style={{ transitionDelay: '0.4s' }}
            >
              <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/images/rings/earrings.jpg"
                  alt="Earrings"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={90}
                />
              </div>
              <h3 className="text-lg font-serif font-normal text-primary-900 mb-2 text-center uppercase tracking-wide">
                EARRINGS
              </h3>
              <p className="text-primary-900 font-light text-center">
                From £199
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Rings Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="scroll-fade-in text-4xl font-serif font-bold text-primary-900 text-center mb-12">
            Shop popular engagement rings
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : rings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${rings.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : rings.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : rings.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
              {rings.map((ring, index) => {
                // CRITICAL: Always use slug, never ID
                if (!ring.slug) {
                  return null
                }
                const slug = ring.slug
                return (
                <Link
                  key={slug}
                  href={`/engagement-rings/${slug}`}
                  className="scroll-scale-in group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="h-64 bg-gray-100 relative overflow-hidden">
                    {ring.featured_image_url || ring.image ? (
                      <Image
                        src={ring.featured_image_url || ring.image}
                        alt={ring.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={(ring.featured_image_url || ring.image)?.includes('supabase.co')}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-primary-800 rounded-full group-hover:scale-110 transition-transform"></div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">{ring.name}</h3>
                    <p className="text-gray-600 mb-2">
                      {ring.metals && Array.isArray(ring.metals) && ring.metals.length > 0
                        ? `Available in: ${ring.metals.slice(0, 2).join(', ')}${ring.metals.length > 2 ? ' + more' : ''}`
                        : 'Available in various metals'}
                    </p>
                    <p className="text-lg font-semibold text-primary-800 mb-4">{ring.price || 'Price on request'}</p>
                    <span className="btn-secondary w-full text-center inline-block">
                      View Details
                    </span>
                  </div>
                </Link>
                )
              }).filter(Boolean)}
            </div>
          )}
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews placeId={process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID} />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section 
        className="section-padding text-white"
        style={{
          background: 'linear-gradient(135deg, #6B4F41 0%, #8B6F47 50%, #A0826D 100%)'
        }}
      >
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-4 tracking-tight">
            Discover our award-winning service for yourself
          </h2>
          <p className="text-lg md:text-xl font-light text-white/90 mb-8">
            Why Choose Jabour Jewellery?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/about" 
              className="px-8 py-3 border-2 border-white text-white font-light uppercase tracking-wide transition-all hover:bg-white hover:text-[#6B4F41] rounded-sm"
            >
              Learn More
            </Link>
            <Link 
              href="/book-appointment" 
              className="px-8 py-3 bg-white text-[#6B4F41] font-light uppercase tracking-wide transition-all hover:bg-white/90 rounded-sm"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
