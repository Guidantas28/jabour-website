'use client'

import { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa'

interface BannerMessage {
  id: number
  text: string
}

const bannerMessages: BannerMessage[] = [
  {
    id: 1,
    text: 'We are pleased to offer complimentary standard shipping on all orders.',
  },
  {
    id: 2,
    text: 'Free resizing service available on all rings.',
  },
  {
    id: 3,
    text: 'Book your VIP consultation today and discover our exclusive collection.',
  },
]

export default function TopBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if banner was dismissed in current session only (sessionStorage)
    const dismissed = sessionStorage.getItem('topBannerDismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
    }
  }, [])

  useEffect(() => {
    // Auto-rotate banners every 5 seconds
    if (bannerMessages.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerMessages.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerMessages.length) % bannerMessages.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerMessages.length)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    // Save only for current session (will reappear on page reload)
    sessionStorage.setItem('topBannerDismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="bg-gold-500 text-white w-full relative overflow-hidden z-[60]">
      <div className="flex items-center justify-center relative px-8 sm:px-12 py-2.5 sm:py-3 min-h-[44px]">
        {/* Left Arrow */}
        {bannerMessages.length > 1 && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded transition-colors flex items-center justify-center"
            aria-label="Previous message"
          >
            <FaChevronLeft className="text-xs text-white" />
          </button>
        )}

        {/* Banner Text */}
        <p className="text-xs sm:text-sm font-sans text-center px-2 sm:px-4 flex-1 leading-relaxed text-white">
          {bannerMessages[currentIndex].text}
        </p>

        {/* Right Arrow */}
        {bannerMessages.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded transition-colors flex items-center justify-center"
            aria-label="Next message"
          >
            <FaChevronRight className="text-xs text-white" />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded transition-colors flex items-center justify-center"
          aria-label="Close banner"
        >
          <FaTimes className="text-xs text-white" />
        </button>
      </div>

      {/* Dots indicator (if multiple messages) */}
      {bannerMessages.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {bannerMessages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1 h-1 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`Go to message ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

