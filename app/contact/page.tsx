'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Map, { Marker, Popup, ViewStateChangeEvent } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

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
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    address: 'Ipanema',
    city: 'Rio de Janeiro, Brazil',
    phone: '+55 21 XXXX XXXX',
    lat: -22.9848,
    lng: -43.1984,
  },
  {
    id: 'miami',
    name: 'Miami',
    address: 'Design District',
    city: 'Miami, FL, USA',
    phone: '+1 305 XXX XXXX',
    lat: 25.8121,
    lng: -80.1918,
  },
]

// Calculate center and bounds for all locations
const calculateMapCenter = () => {
  const lats = storeLocations.map(loc => loc.lat)
  const lngs = storeLocations.map(loc => loc.lng)
  return {
    latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
    longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  }
}

// Calculate bounds for all locations
const calculateBounds = () => {
  const lats = storeLocations.map(loc => loc.lat)
  const lngs = storeLocations.map(loc => loc.lng)
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [viewState, setViewState] = useState({
    ...calculateMapCenter(),
    zoom: 2,
  })
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const mapRef = useRef<any>(null)

  // Get Mapbox API key
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

  // Adjust map view when loaded
  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      const bounds = calculateBounds()
      const center = calculateMapCenter()
      
      // Calculate appropriate zoom level
      const latDiff = bounds.north - bounds.south
      const lngDiff = bounds.east - bounds.west
      const maxDiff = Math.max(latDiff, lngDiff)
      
      let zoom = 2
      if (maxDiff < 0.1) zoom = 10
      else if (maxDiff < 0.5) zoom = 6
      else if (maxDiff < 1) zoom = 4
      else if (maxDiff < 5) zoom = 3
      
      setViewState({
        ...center,
        zoom,
      })
    }
  }, [isMapLoaded])

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

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true)
    setMapError(null)
    
    if (mapRef.current) {
      // @ts-ignore - getMap may not be in types
      const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current
      const bounds = calculateBounds()
      
      // Fit bounds to show all markers with padding
      if (map && map.fitBounds) {
        map.fitBounds(
          [
            [bounds.west, bounds.south],
            [bounds.east, bounds.north]
          ],
          {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            duration: 1000,
          }
        )
      } else {
        // Fallback: adjust viewState directly
        const center = calculateMapCenter()
        setViewState({
          ...center,
          zoom: 2,
        })
      }
    }
  }, [])

  const handleMarkerClick = (storeId: string) => {
    setSelectedStore(storeId)
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
            {mapboxToken ? (
              <div className="w-full h-[500px] relative">
                <Map
                  {...viewState}
                  onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                  mapboxAccessToken={mapboxToken}
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="mapbox://styles/mapbox/light-v11"
                  onLoad={handleMapLoad}
                  ref={mapRef}
                  attributionControl={false}
                >
                  {storeLocations.map((store) => (
                    <div key={store.id}>
                      <Marker
                        longitude={store.lng}
                        latitude={store.lat}
                        anchor="bottom"
                        onClick={() => handleMarkerClick(store.id)}
                      >
                        <div className="cursor-pointer">
                          <div className="relative">
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </Marker>
                      {selectedStore === store.id && (
                        <Popup
                          longitude={store.lng}
                          latitude={store.lat}
                          anchor="bottom"
                          onClose={() => setSelectedStore(null)}
                          closeButton={true}
                          closeOnClick={false}
                          className="mapbox-popup"
                        >
                          <div className="p-3 max-w-xs">
                            <h3 className="font-bold text-primary-900 mb-2 text-lg">{store.name}</h3>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-700">{store.address}</p>
                              <p className="text-sm text-gray-700">{store.city}</p>
                              <p className="text-sm text-gray-700 font-medium mt-2">{store.phone}</p>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ' ' + store.city)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-3 text-sm text-primary-800 hover:text-primary-900 font-medium"
                            >
                              Ver no Google Maps →
                            </a>
                          </div>
                        </Popup>
                      )}
                    </div>
                  ))}
                </Map>
              </div>
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center p-6">
                  <p className="text-gray-600 mb-2">
                    Mapbox Access Token não configurado
                  </p>
                  <p className="text-sm text-gray-500">
                    Por favor, configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN no arquivo .env
                  </p>
                </div>
              </div>
            )}
            {mapError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p className="text-sm">{mapError}</p>
              </div>
            )}
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
