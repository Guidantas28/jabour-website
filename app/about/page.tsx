'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Smooth scroll behavior
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth'
    }

    const ctx = gsap.context(() => {
      // Parallax effect for background
      if (backgroundRef.current && heroRef.current) {
        gsap.to(backgroundRef.current, {
          y: -100,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }

      // Subtle overlay animation
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0.95,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      // Hero section animations with more sophisticated effects
      if (titleRef.current && subtitleRef.current && dividerRef.current) {
        // Title animation with stagger for letters effect
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 1.4,
          ease: 'power4.out',
        })
        
        // Subtitle with fade and slide
        gsap.from(subtitleRef.current, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          delay: 0.4,
          ease: 'power3.out',
        })
        
        // Divider with scale and fade
        gsap.from(dividerRef.current, {
          scaleX: 0,
          opacity: 0,
          duration: 1,
          delay: 0.8,
          ease: 'power2.out',
        })
      }

      // Section animations with ScrollTrigger
      sectionRefs.current.forEach((section, index) => {
        if (!section) return

        const title = section.querySelector('h2')
        const paragraphs = section.querySelectorAll('p')
        const quote = section.querySelector('.quote-box')

        if (title) {
          gsap.from(title, {
            y: 80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          })
        }

        if (paragraphs.length > 0) {
          gsap.from(paragraphs, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          })
        }

        if (quote) {
          gsap.from(quote, {
            scale: 0.95,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: quote,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      })

      // Image parallax and reveal effects
      imageRefs.current.forEach((imageContainer) => {
        if (!imageContainer) return

        const image = imageContainer.querySelector('img')

        // Parallax effect
        gsap.to(image, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: imageContainer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })

        // Reveal animation with scale and opacity
        gsap.from(imageContainer, {
          scale: 1.05,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageContainer,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
        
        // Add subtle hover effect
        imageContainer.addEventListener('mouseenter', () => {
          gsap.to(image, {
            scale: 1.05,
            duration: 0.6,
            ease: 'power2.out',
          })
        })
        
        imageContainer.addEventListener('mouseleave', () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          })
        })
      })

      // CTA section animation
      const ctaSection = document.querySelector('.cta-section')
      if (ctaSection) {
        const ctaTitle = ctaSection.querySelector('h2')
        const ctaText = ctaSection.querySelector('p')
        const ctaButtons = ctaSection.querySelectorAll('a')

        if (ctaTitle) {
          gsap.from(ctaTitle, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaSection,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          })
        }

        if (ctaText) {
          gsap.from(ctaText, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaSection,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          })
        }

        if (ctaButtons.length > 0) {
          gsap.from(ctaButtons, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaSection,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image - Calçada de Ipanema with parallax */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/about/ipanema.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
          }}
        />
        
        {/* Gradient Overlay - more visible calçada */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 z-10 bg-gradient-to-b from-white/85 via-white/70 to-white/85"
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/50 via-transparent to-white/50"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gold-50/30 via-transparent to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-20 container-custom max-w-5xl mx-auto text-center w-full py-24 px-4">
          <div className="space-y-8">
            <h1 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary-900 tracking-tight">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-white/40 blur-xl"></span>
                <span className="relative">ABOUT JABOUR & CO</span>
              </span>
            </h1>
            <p ref={subtitleRef} className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-primary-800 italic leading-relaxed px-4">
              A modern luxury jewellery house built on intention, craftsmanship, and clarity.
            </p>
            <div ref={dividerRef} className="w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto origin-center"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section 
        ref={(el) => { sectionRefs.current[0] = el }}
        className="section-padding bg-gradient-to-b from-white via-gold-50/40 to-white py-24"
      >
        <div className="container-custom max-w-5xl mx-auto">
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
            <p className="text-xl font-normal text-primary-900">
              Jabour & Co was created with a simple purpose:
            </p>
            <p className="text-xl">
              to bring honesty, education, and meaningful design back into the jewellery experience.
            </p>
            <p>
              In a world filled with overwhelming information and mass-produced pieces, we focus on what truly matters personal connection, refined craftsmanship, and a process that feels effortless and transparent.
            </p>
            <div className="pt-8 pb-4">
              <p className="text-xl font-normal text-primary-900">
                Every piece at Jabour begins with a story.
              </p>
              <p className="text-xl font-normal text-primary-900">
                Your story.
              </p>
            </div>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent my-6"></div>
            <p>
              We take the time to understand the intention behind your jewellery the moment, the meaning, the emotion — and translate it into a design that feels timeless and personal. Whether you're crafting a bespoke engagement ring, selecting a diamond, or requesting a valuation, you receive expert guidance, clear information, and a level of care that reflects the significance of your purchase.
            </p>
          </div>
        </div>
      </section>

      {/* We Combine */}
      <section 
        ref={(el) => { sectionRefs.current[1] = el }}
        className="section-padding bg-gradient-to-b from-gold-50/40 via-white to-gold-50/40 py-24 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container-custom max-w-5xl mx-auto relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-8 tracking-tight">
              We combine:
            </h2>
          </div>
          <div className="space-y-5 text-gray-700 leading-relaxed text-lg font-light">
            <p className="text-xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              Bespoke design
            </p>
            <p className="text-xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              Precise craftsmanship
            </p>
            <p className="text-xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              Luxury client experience
            </p>
            <p className="text-xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              Ethical and responsible sourcing
            </p>
            <p className="text-xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              Founder-led service
            </p>
            <p className="text-xl flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              U.K. artistry with international reach
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section 
        ref={(el) => { sectionRefs.current[2] = el }}
        className="section-padding bg-gradient-to-b from-white via-primary-50/30 to-white py-24"
      >
        <div className="container-custom max-w-5xl mx-auto">
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
            <p>
              Guided by Founder & Director Bryan Bolzan, Jabour & Co brings together years of experience in luxury retail, gemology education, bespoke creation, and the highest standards of customer care.
            </p>
            <p className="text-xl font-normal text-primary-900 pt-4">
              Our pieces are crafted to be more than accessories 
            </p>
            <p className="text-xl font-normal text-primary-900">
              they are symbols of commitment, milestones, and memories that last a lifetime.
            </p>
            <div className="pt-8 mt-8 border-t-2 border-gold-200/50">
              <p className="text-2xl font-normal text-primary-900">
                This is modern bridal jewellery.
              </p>
              <p className="text-2xl font-normal text-primary-900">
                Clear. Personal. Intentional.
              </p>
              <p className="text-2xl font-normal text-gold-600">
                This is Jabour & Co.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Diamond Sourcing */}
      <section 
        ref={(el) => { sectionRefs.current[4] = el }}
        className="section-padding bg-gradient-to-b from-gold-50/30 via-white to-gold-50/30 py-24 relative overflow-hidden"
      >
        {/* Decorative accent */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold-200/15 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-8 tracking-tight relative">
                Responsible Diamond
                <br />
                <span className="font-light">Sourcing</span>
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 via-gold-500 to-gold-400 rounded-full"></div>
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
                <p>
                  At Jabour, integrity is at the heart of everything we create, and that begins with the origin of our stones. Every diamond and gemstone we use is ethically sourced from trusted, reputable suppliers who share our values of transparency and responsibility.
                </p>
                <p>
                  We are proud supporters of the Kimberley Process, an international initiative that has helped eliminate 99.8% of the global trade in conflict diamonds. Through this commitment, we ensure that every stone we select represents not only beauty, but also respect, for people, for communities, and for our planet.
                </p>
                <p>
                  In addition, we are continuously expanding our lab-grown diamond collection, offering clients an expert-curated selection of sustainable, high-quality alternatives that meet Jabour's exacting standards of brilliance and craftsmanship.
                </p>
                <p className="text-xl font-normal text-primary-900 pt-4">
                  Because to us, a truly beautiful diamond is one that shines with ethics, care, and conscience.
                </p>
              </div>
            </div>
            <div 
              ref={(el) => { imageRefs.current[0] = el }}
              className="relative h-[600px] rounded-sm overflow-hidden shadow-xl"
            >
              <Image
                src="/images/about/responsible.jpeg"
                alt="Responsible Diamond Sourcing"
                fill
                className="object-cover"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Packaging */}
      <section 
        ref={(el) => { sectionRefs.current[5] = el }}
        className="section-padding bg-gradient-to-b from-white via-primary-50/25 to-white py-24"
      >
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div 
              ref={(el) => { imageRefs.current[1] = el }}
              className="relative h-[600px] rounded-sm overflow-hidden shadow-xl order-2 md:order-1"
            >
              <Image
                src="/images/about/our-packing-jabour.jpeg"
                alt="Our Packaging"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-8 tracking-tight relative inline-block">
                Our Packaging
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
                <p>
                  At Jabour, we believe that the experience of receiving your jewellery should be as meaningful as the piece itself. Every element of our packaging is designed with intention, love, and a touch of our heritage.
                </p>
                <p>
                  We embrace bright, vibrant colours and rich textures that reflect the warmth and spirit of our Brazilian roots, a reminder of where our story began. Each box is crafted to deliver not just a jewel, but a feeling: love, care, and connection.
                </p>
                <p>
                  Inside, your chosen piece rests safely and elegantly, accompanied by the official certificates of your gemstones or diamonds, presented in a beautifully designed envelope. From the moment you open your box, we want you to feel the same emotion, joy, and authenticity that go into every Jabour creation.
                </p>
                <p className="text-xl font-normal text-primary-900 pt-4">
                  Because at Jabour, every detail matters, from our hands to your heart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding bg-gradient-to-b from-primary-900 to-primary-800 py-24 text-white">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-tight">
            Discover Our
            <br />
            <span className="font-normal">Craftsmanship</span>
          </h2>
          <p className="text-xl font-light text-primary-100 mb-12 max-w-2xl mx-auto italic">
            Experience the artistry and emotion behind every Jabour creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/engagement-rings" 
              className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider transition-colors min-w-[250px] text-center"
            >
              View Our Collection
            </Link>
            <Link 
              href="/book-appointment" 
              className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider hover:bg-white/10 transition-colors min-w-[250px] text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}