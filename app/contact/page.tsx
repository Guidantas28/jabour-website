'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Store locations data
const storeLocations = [
  {
    id: 'london',
    name: 'London',
    address: 'Hatton Garden, EC1N 8NX',
    city: 'London, United Kingdom',
    phone: '+44 20 7831 1901',
    lat: 51.5194,
    lng: -0.1060,
    mapX: 50, // Percentage from left
    mapY: 30, // Percentage from top
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    address: 'Ipanema',
    city: 'Rio de Janeiro, Brazil',
    phone: '+55 21 XXXX XXXX',
    lat: -22.9848,
    lng: -43.1984,
    mapX: 30,
    mapY: 64,
  },
  {
    id: 'miami',
    name: 'Miami',
    address: 'Design District',
    city: 'Miami, FL, USA',
    phone: '+1 305 XXX XXXX',
    lat: 25.8121,
    lng: -80.1918,
    mapX: 25,
    mapY: 40,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

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

      // Content section
      if (contentRef.current) {
        const contentItems = contentRef.current.querySelectorAll('.content-item')
        gsap.from(contentItems, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Form section
      if (formRef.current) {
        const formItems = formRef.current.querySelectorAll('.form-item')
        gsap.from(formItems, {
          x: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 ref={heroTitleRef} className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Contact Us
          </h1>
          <p ref={heroSubtitleRef} className="text-xl text-gray-600 max-w-3xl">
            Get in touch or book an appointment with our experts.
          </p>
        </div>
      </section>

      {/* Find a Store Near You Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4 text-center">
            Find a Store Near You
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Visit us at one of our locations around the world
          </p>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-[500px] relative bg-gradient-to-br from-blue-50 via-white to-green-50">
              {/* Interactive World Map with Pins */}
              <div className="relative w-full h-full">
                <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Simplified world map continents */}
                  <g opacity="0.2">
                    {/* Europe */}
                    <path d="M 400 100 Q 450 80 500 100 Q 550 120 600 110 Q 650 100 700 120 L 700 200 L 400 200 Z" fill="#94a3b8" />
                    {/* North America */}
                    <path d="M 150 80 Q 200 60 250 100 Q 280 130 300 120 Q 320 110 350 140 L 350 220 L 150 220 Z" fill="#94a3b8" />
                    {/* South America */}
                    <path d="M 250 250 Q 280 240 300 260 Q 320 280 340 300 Q 320 350 300 380 L 250 380 Z" fill="#94a3b8" />
                  </g>
                  
                  {/* Store Location Markers */}
                  {storeLocations.map((store, index) => (
                    <g 
                      key={store.id}
                      transform={`translate(${store.mapX * 10}, ${store.mapY * 5})`}
                      className="cursor-pointer group"
                      onClick={() => {
                        const card = document.getElementById(`store-${store.id}`)
                        if (card) {
                          card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          card.classList.add('ring-2', 'ring-primary-900')
                          setTimeout(() => card.classList.remove('ring-2', 'ring-primary-900'), 2000)
                        }
                      }}
                    >
                      {/* Pulse animation circle */}
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="20" 
                        fill="#dc2626" 
                        opacity="0.2"
                        className="animate-ping"
                      />
                      {/* Marker pin */}
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="12" 
                        fill="#dc2626" 
                        stroke="white" 
                        strokeWidth="3"
                        className="group-hover:scale-125 transition-transform"
                      />
                      <circle cx="0" cy="0" r="6" fill="white" />
                      {/* Pin line */}
                      <line x1="0" y1="12" x2="0" y2="35" stroke="#dc2626" strokeWidth="2" />
                      {/* Location label */}
                      <text 
                        x="0" 
                        y="50" 
                        textAnchor="middle" 
                        className="text-sm font-bold fill-primary-900 group-hover:fill-primary-800 transition-colors"
                        style={{ fontSize: '14px', fontWeight: 'bold' }}
                      >
                        {store.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Store Locations Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {storeLocations.map((store) => (
              <div 
                key={store.id}
                id={`store-${store.id}`}
                className="bg-white rounded-lg shadow-md p-6 content-item transition-all hover:shadow-lg hover:scale-105"
              >
                <h3 className="text-xl font-serif font-bold text-primary-900 mb-3">{store.name}</h3>
                <p className="text-gray-700 mb-2">{store.address}</p>
                <p className="text-gray-700 mb-2">{store.city}</p>
                <p className="text-gray-700 mb-4">Phone: {store.phone}</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address + ' ' + store.city)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-800 hover:text-primary-900 font-medium inline-flex items-center gap-1"
                >
                  View on Map →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div ref={contentRef}>
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-8 content-item">
                Visit Our Showroom
              </h2>
              <div className="space-y-6 mb-8">
                <div className="content-item">
                  <h3 className="font-semibold text-primary-900 mb-2">Opening Times</h3>
                  <p className="text-gray-700">Monday to Friday: 10am - 6:30pm</p>
                  <p className="text-gray-700">Saturday: 10am - 5pm</p>
                  <p className="text-gray-700">Sundays & Bank Holidays: Closed</p>
                </div>
                <div className="content-item">
                  <h3 className="font-semibold text-primary-900 mb-2">Address</h3>
                  <p className="text-gray-700">Hatton Garden, London</p>
                  <p className="text-gray-700">EC1N 8NX</p>
                </div>
                <div className="content-item">
                  <h3 className="font-semibold text-primary-900 mb-2">Contact</h3>
                  <p className="text-gray-700">Phone: +44 20 7831 1901</p>
                  <p className="text-gray-700">Email: info@jabourjewellery.co.uk</p>
                </div>
              </div>
              <a href="/book-appointment" className="btn-primary content-item">
                Book Appointment
              </a>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-8">
                Send Us a Message
              </h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="form-item">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  />
                </div>
                <button type="submit" className="btn-primary w-full form-item">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
