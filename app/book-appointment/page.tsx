'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function BookAppointmentPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

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

      // Calendar section
      if (calendarRef.current) {
        gsap.from(calendarRef.current, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: calendarRef.current,
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
            Book Your Appointment
          </h1>
          <p ref={heroSubtitleRef} className="text-xl text-gray-600 max-w-3xl">
            Meet with one of our experts in-store or online. We'll guide you through choosing
            your diamond or gemstone, understanding styles and designing your ring.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div ref={calendarRef} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg p-12">
            <div className="text-center space-y-8 mb-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif font-normal text-primary-900">
                  Select Your Preferred Date and Time
                </h2>
                <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                  Choose a convenient date and time for your appointment using the calendar below.
                </p>
              </div>
            </div>
            
            {/* Google Calendar Appointment Scheduling */}
            <iframe 
              src="https://calendar.google.com/calendar/appointments/AcZssZ3Xe-KXeVdqxYosRobNO1fIgn83Cru5edTR-uQ=?gv=true" 
              style={{ border: 0 }} 
              width="100%" 
              height="600" 
              frameBorder="0"
              title="Google Calendar Appointment Scheduling"
            ></iframe>
            {/* end Google Calendar Appointment Scheduling */}
          </div>
        </div>
      </section>
    </div>
  )
}
