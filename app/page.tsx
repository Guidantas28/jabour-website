'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  FaHammer, 
  FaLeaf, 
  FaCertificate, 
  FaShieldAlt, 
  FaRulerCombined, 
  FaUndo 
} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
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
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'engagement-rings')
        .order('created_at', { ascending: false })
        .limit(4)

      if (products && products.length > 0) {
        setRings(products)
      } else {
        // Fallback to Marquise Solitaire
        setRings([{
          id: 'marquise-solitaire',
          name: 'Marquise Solitaire',
          price: 'From £1,200',
          metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
          image: 'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise_1.jpg',
          diamond_shapes: ['Marquise'],
          style: 'solitaire',
        }])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to Marquise Solitaire on error
      setRings([{
        id: 'marquise-solitaire',
        name: 'Marquise Solitaire',
        price: 'From £1,200',
        metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold', '9k White Gold', '9k Yellow Gold', '9k Rose Gold'],
        image: 'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise_1.jpg',
        diamond_shapes: ['Marquise'],
        style: 'solitaire',
      }])
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
              <h3 className="text-xl font-semibold mb-2">Book your free appointment</h3>
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

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-serif font-bold text-primary-900 text-center mb-12 scroll-fade-in">
            Shop by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/engagement-rings"
              className="scroll-fade-in group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Engagement Rings
                </h3>
              </div>
            </Link>
            <Link
              href="/wedding-rings"
              className="scroll-fade-in group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ transitionDelay: '0.15s' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Wedding Rings
                </h3>
              </div>
            </Link>
            <Link
              href="/diamonds"
              className="scroll-fade-in group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ transitionDelay: '0.3s' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Lab Grown Diamonds
                </h3>
              </div>
            </Link>
            <Link
              href="/jewellery"
              className="scroll-fade-in group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ transitionDelay: '0.45s' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Jewellery
                </h3>
              </div>
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
              {rings.map((ring, index) => (
                <Link
                  key={ring.id}
                  href={ring.id === 'marquise-solitaire' ? '/engagement-rings/marquise-trilogy' : `/engagement-rings/${ring.id}`}
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="section-padding bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">
            Discover our award-winning service for yourself
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Why Choose Jabour Jewellery?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-900">
              Learn More
            </Link>
            <Link href="/book-appointment" className="btn-primary bg-white text-primary-900 hover:bg-primary-50">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
