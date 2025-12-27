'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGem, FaCircle, FaCertificate, FaFlask, FaMedal } from 'react-icons/fa'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const educationTopics = [
  {
    id: 'shape',
    title: 'Shape',
    icon: <FaGem className="text-4xl text-gold-500" />,
    image: '/images/education/shape.jpg',
  },
  {
    id: 'carat',
    title: 'Carat',
    icon: <FaCircle className="text-4xl text-gold-500" />,
    image: '/images/education/carat.jpg',
  },
  {
    id: 'colour',
    title: 'Colour',
    icon: <FaGem className="text-4xl text-gold-500" />,
    image: '/images/education/colour.jpg',
  },
  {
    id: 'clarity',
    title: 'Clarity',
    icon: <FaGem className="text-4xl text-gold-500" />,
    image: '/images/education/clarity.jpg',
  },
  {
    id: 'cut',
    title: 'Cut',
    icon: <FaCircle className="text-4xl text-gold-500" />,
    image: '/images/education/cut.jpg',
  },
  {
    id: 'certificates',
    title: 'Certificates',
    icon: <FaCertificate className="text-4xl text-gold-500" />,
    image: '/images/education/certificates.jpg',
  },
  {
    id: 'lab-grown-diamonds',
    title: 'Lab Grown Diamonds',
    icon: <FaFlask className="text-4xl text-gold-500" />,
    image: '/images/education/lab-grown.jpg',
  },
  {
    id: 'precious-metal',
    title: 'Precious Metal',
    icon: <FaMedal className="text-4xl text-gold-500" />,
    image: '/images/education/precious-metal.jpg',
  },
]

export default function EducationPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const heroDividerRef = useRef<HTMLDivElement>(null)
  const topicsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // GSAP animations
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Hero section animations
      if (heroTitleRef.current && heroSubtitleRef.current && heroDividerRef.current) {
        gsap.from(heroTitleRef.current, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
        
        gsap.from(heroSubtitleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
        })
        
        gsap.from(heroDividerRef.current, {
          scaleX: 0,
          opacity: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'power2.out',
        })
      }

      // Topics grid
      if (topicsRef.current) {
        const topicCards = topicsRef.current.querySelectorAll('.topic-card')
        
        if (topicCards.length > 0) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            // Check if section is already visible
            const rect = topicsRef.current?.getBoundingClientRect()
            const isVisible = rect && rect.top < window.innerHeight * 0.9
            
            if (isVisible) {
              // If already visible, just set to final state
              gsap.set(topicCards, {
                opacity: 1,
                y: 0,
                scale: 1,
              })
            } else {
              // If not visible, set initial state and animate on scroll
              gsap.set(topicCards, {
                opacity: 0,
                y: 80,
                scale: 0.9,
              })
              
              gsap.to(topicCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: topicsRef.current,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              })
            }
          })
        }
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 ref={heroTitleRef} className="text-6xl md:text-7xl lg:text-8xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Education
          </h1>
          <p ref={heroSubtitleRef} className="text-lg md:text-xl font-light text-gray-700 mb-4 leading-relaxed max-w-3xl mx-auto">
            Choosing the perfect engagement ring for your partner is a thrilling experience but can also feel quite daunting to begin with. Don't panic, the perfect engagement ring is here waiting for you, and our engagement ring buying guide will help you on your journey to the perfect diamond ring.
          </p>
          <div ref={heroDividerRef} className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-7xl mx-auto">
          <div ref={topicsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {educationTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/education/${topic.id}`}
                className="topic-card group relative bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-gold-500"
              >
                <div className="aspect-square p-8 flex flex-col items-center justify-center">
                  {/* Image placeholder or icon */}
                  <div className="w-full h-48 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm flex items-center justify-center relative overflow-hidden">
                    {topic.id === 'certificates' ? (
                      // Custom GIA Certificate Visual
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        {/* GIA Certificate Badge */}
                        <div className="bg-white border-2 border-gold-500 rounded-sm p-4 shadow-lg transform group-hover:scale-105 transition-transform">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-900 mb-1" style={{ fontFamily: 'serif' }}>
                              GIA
                            </div>
                            <div className="text-xs text-gray-600 uppercase tracking-wider font-light">
                              Certificate
                            </div>
                          </div>
                        </div>
                        {/* Small certificate icon overlay */}
                        <FaCertificate className="absolute bottom-2 right-2 text-gold-500 opacity-20 text-2xl" />
                      </div>
                    ) : (
                      topic.icon || (
                      <div className="text-6xl text-gray-300">
                        <FaGem />
                      </div>
                      )
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-normal text-primary-900 text-center group-hover:text-gold-500 transition-colors">
                    {topic.title}
                  </h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 transition-colors pointer-events-none"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="section-padding bg-gray-50 py-16">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Still Have Questions?
          </h2>
          <p className="text-lg font-light text-gray-700 mb-8 max-w-2xl mx-auto">
            Our experts are here to guide you through every step of your journey.
          </p>
          <Link
            href="/book-appointment"
            className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider transition-colors"
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
