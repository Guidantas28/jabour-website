'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function WeddingRingsPage() {
  const rings = [
    {
      id: 'classic-plain',
      name: 'Classic Plain',
      category: 'Simple',
      price: 'From £495',
    },
    {
      id: 'diamond-eternity',
      name: 'Diamond Eternity',
      category: 'Diamond',
      price: 'From £1,195',
    },
    {
      id: 'comfort-fit',
      name: 'Comfort Fit',
      category: 'Simple',
      price: 'From £595',
    },
    {
      id: 'twisted-band',
      name: 'Twisted Band',
      category: 'Simple',
      price: 'From £750',
    },
  ]

  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const ringsRef = useRef<HTMLDivElement>(null)

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
        gsap.from(filtersRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Rings grid
      if (ringsRef.current) {
        const ringCards = ringsRef.current.querySelectorAll('.ring-card')
        gsap.from(ringCards, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ringsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 ref={heroTitleRef} className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Wedding Rings
          </h1>
          <p ref={heroSubtitleRef} className="text-xl text-gray-600 max-w-3xl">
            Discover our beautiful collection of wedding rings for him and her, crafted to complement
            your engagement ring perfectly.
          </p>
        </div>
      </section>

      <section ref={filtersRef} className="bg-white border-b border-gray-200 py-6">
        <div className="container-custom">
          <div className="flex gap-4">
            <Link href="/wedding-rings" className="font-semibold text-primary-900 border-b-2 border-primary-900 pb-2">
              All Rings
            </Link>
            <Link href="/wedding-rings?category=womens" className="text-gray-600 hover:text-primary-800">
              Women's Wedding Rings
            </Link>
            <Link href="/wedding-rings?category=mens" className="text-gray-600 hover:text-primary-800">
              Men's Wedding Rings
            </Link>
            <Link href="/wedding-rings?category=eternity" className="text-gray-600 hover:text-primary-800">
              Eternity Rings
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div ref={ringsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rings.map((ring) => (
              <Link
                key={ring.id}
                href={`/wedding-rings/${ring.id}`}
                className="ring-card group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="w-24 h-24 border-4 border-primary-800 rounded-full"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">
                    {ring.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{ring.category}</p>
                  <p className="text-lg font-semibold text-primary-800 mb-4">{ring.price}</p>
                  <button className="btn-secondary w-full">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
