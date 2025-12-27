'use client'

import Link from 'next/link'
import { Suspense, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function BraceletsContent() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const emptyStateRef = useRef<HTMLDivElement>(null)
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

      // Empty state section
      if (emptyStateRef.current) {
        gsap.from(emptyStateRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: emptyStateRef.current,
            start: 'top 80%',
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
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 ref={heroTitleRef} className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Bracelets
          </h1>
          <p ref={heroSubtitleRef} className="text-xl text-gray-600 max-w-3xl">
            Discover our exquisite collection of bespoke bracelets, crafted with precision
            and care in our Hatton Garden workshop.
          </p>
        </div>
      </section>

      {/* Empty State */}
      <section className="section-padding bg-white">
        <div ref={emptyStateRef} className="container-custom text-center py-12">
          <p className="text-lg text-gray-600 mb-8">
            Our bracelets collection is coming soon.
          </p>
          <Link href="/book-appointment" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Book a free consultation with our experts to create a bespoke piece.
          </p>
          <Link href="/book-appointment" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function BraceletsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <BraceletsContent />
    </Suspense>
  )
}


