'use client'

import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaGift, FaStar } from 'react-icons/fa'
import { gsap } from 'gsap'

interface ChristmasPopupProps {
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function ChristmasPopup({ onClose, onSubmit }: ChristmasPopupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate popup entrance
    if (typeof window !== 'undefined' && popupRef.current && overlayRef.current) {
      try {
        gsap.from(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        })
        
        gsap.from(popupRef.current, {
          scale: 0.9,
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: 'back.out(1.7)',
        })
      } catch (error) {
        // If GSAP fails, just show the popup without animation
        if (overlayRef.current) overlayRef.current.style.opacity = '1'
        if (popupRef.current) popupRef.current.style.opacity = '1'
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      return
    }

    setIsSubmitting(true)

    try {
      // Save to localStorage to prevent showing again
      localStorage.setItem('christmas_popup_submitted', 'true')
      localStorage.setItem('christmas_popup_email', email)

      // Call parent onSubmit handler to save lead
      onSubmit(email)

      setIsSubmitted(true)
      
      // Close popup after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (popupRef.current && overlayRef.current) {
      gsap.to(popupRef.current, {
        scale: 0.9,
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: 'power2.in',
      })
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      })
    } else {
      onClose()
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        ref={popupRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close popup"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-500/10 rounded-full -ml-12 -mb-12"></div>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="relative pt-8 pb-6 px-6 text-center bg-gradient-to-br from-gold-50 to-white">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <FaGift className="text-5xl text-gold-500 animate-bounce" />
                  <FaStar className="absolute -top-2 -right-2 text-gold-400 text-xl animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary-900 mb-2">
                Christmas Special
              </h2>
              <p className="text-gold-600 font-semibold text-lg">
                10% OFF + Complimentary Earrings
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                Celebrate the season with our exclusive Christmas offer! Get{' '}
                <span className="font-semibold text-gold-600">10% off</span> your purchase plus{' '}
                <span className="font-semibold text-gold-600">complimentary earrings</span>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Claiming Offer...' : 'Claim My Offer'}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Limited time offer. Terms and conditions apply.
              </p>
            </div>
          </>
        ) : (
          <div className="py-12 px-6 text-center">
            <div className="mb-4">
              <FaGift className="text-6xl text-gold-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-700">
              Check your email for your exclusive offer code.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

