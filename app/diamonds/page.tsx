'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function DiamondsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

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

      // Options section
      if (optionsRef.current) {
        const optionCards = optionsRef.current.querySelectorAll('.option-card')
        gsap.from(optionCards, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: optionsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Shapes section
      if (shapesRef.current) {
        const shapeItems = shapesRef.current.querySelectorAll('.shape-item')
        gsap.from(shapeItems, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: shapesRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Info section
      if (infoRef.current) {
        gsap.from(infoRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: infoRef.current,
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
      <section ref={heroRef} className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 ref={heroTitleRef} className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Diamonds
          </h1>
          <p ref={heroSubtitleRef} className="text-xl text-gray-600 max-w-3xl">
            Explore our collection of ethically sourced natural and lab grown diamonds,
            all certified and ready to be set in your perfect ring.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div ref={optionsRef} className="grid md:grid-cols-2 gap-8 mb-12">
            <Link href="/diamonds/natural" className="option-card group relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Natural Diamonds</h2>
                <p className="text-lg text-gray-700">Search our collection</p>
              </div>
            </Link>
            <Link href="/diamonds/lab-grown" className="option-card group relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Lab Grown Diamonds</h2>
                <p className="text-lg text-gray-700">Search our collection</p>
              </div>
            </Link>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
              Shop diamonds by shape
            </h2>
            <div ref={shapesRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {['Round', 'Oval', 'Cushion', 'Pear', 'Emerald', 'Princess', 'Heart', 'Marquise'].map((shape) => (
                <Link
                  key={shape}
                  href={`/diamonds?shape=${shape.toLowerCase()}`}
                  className="shape-item text-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-800 transition-colors"
                >
                  <div className="w-16 h-16 border-2 border-primary-800 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium">{shape}</span>
                </Link>
              ))}
            </div>
          </div>

          <div ref={infoRef} className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              Lab Grown vs Natural Diamonds
            </h3>
            <p className="text-gray-700 mb-6">
              Both lab grown and natural diamonds are real diamonds, chemically identical. Lab grown diamonds
              offer excellent value and are more sustainable, while natural diamonds have a unique history
              spanning millions of years.
            </p>
            <Link href="/education/lab-grown-diamonds" className="text-primary-800 font-semibold hover:underline">
              Learn more in our diamond guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
