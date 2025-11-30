'use client'

import { useState, useEffect, useRef } from 'react'
import { FaStar, FaGoogle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Review {
  author_name: string
  rating: number
  text: string
  time?: number
  relative_time_description?: string
}

interface GoogleReviewsProps {
  placeId?: string
}

export default function GoogleReviews({ placeId }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number>(0)
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    if (reviews.length > 0 && isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
      }, 5000) // Auto-advance every 5 seconds

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current)
        }
      }
    }
  }, [reviews.length, isAutoPlaying])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/google-reviews')
      const data = await response.json()
      
      setReviews(data.reviews || [])
      setRating(data.rating || 0)
      setTotalReviews(data.total_reviews || 0)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Recently'
    
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % reviews.length)
  }

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + reviews.length) % reviews.length)
  }


  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
            <p className="text-gray-600 mt-4">Loading reviews...</p>
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  // Get visible reviews (show 3 at a time, cycling through)
  const getVisibleReviews = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length
      visible.push(reviews[index])
    }
    return visible
  }

  const visibleReviews = getVisibleReviews()

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGoogle className="text-3xl text-gold-500" />
            <h2 className="text-4xl font-serif font-bold text-primary-900">
              What Our Customers Say
            </h2>
          </div>
          {rating > 0 && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg ${
                      i < Math.round(rating)
                        ? 'text-gold-500'
                        : 'text-gray-300'
                    }`}
                    fill={i < Math.round(rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xl font-semibold text-primary-900">
                {rating.toFixed(1)}
              </span>
              {totalReviews > 0 && (
                <span className="text-gray-600">
                  ({totalReviews} reviews)
                </span>
              )}
            </div>
          )}
          <p className="text-lg text-gray-600">
            Real reviews from our valued customers
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-0">
          {/* Navigation Arrows */}
          {reviews.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-gold-50 border border-gray-200 group"
                aria-label="Previous review"
              >
                <FaChevronLeft className="text-gold-500 group-hover:text-gold-600 transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:bg-gold-50 border border-gray-200 group"
                aria-label="Next review"
              >
                <FaChevronRight className="text-gold-500 group-hover:text-gold-600 transition-colors" />
              </button>
            </>
          )}

          {/* Reviews Slider */}
          <div 
            ref={sliderRef}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {visibleReviews.map((review, reviewIndex) => (
                <div
                  key={`${currentIndex}-${reviewIndex}`}
                  className="transform transition-all duration-500 ease-in-out animate-fade-in"
                >
                  <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm md:text-base ${
                            i < review.rating
                              ? 'text-gold-500'
                              : 'text-gray-300'
                          }`}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6 font-light text-sm md:text-base flex-grow">
                      "{typeof review.text === 'string' ? review.text : String(review.text || '')}"
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                      <div>
                        <p className="font-semibold text-primary-900 text-sm md:text-base">
                          {typeof review.author_name === 'string' ? review.author_name : String(review.author_name || 'Anonymous')}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {formatDate(review.time)}
                        </p>
                      </div>
                      <div className="bg-gold-50 rounded-full p-2">
                        <FaGoogle className="text-gold-500 text-sm md:text-base" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          {reviews.length > 1 && (
            <div className="flex md:hidden justify-center gap-4 mt-6">
              <button
                onClick={prevSlide}
                className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all hover:bg-gold-50 border border-gray-200"
                aria-label="Previous review"
              >
                <FaChevronLeft className="text-gold-500" />
              </button>
              <button
                onClick={nextSlide}
                className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all hover:bg-gold-50 border border-gray-200"
                aria-label="Next review"
              >
                <FaChevronRight className="text-gold-500" />
              </button>
            </div>
          )}

          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'bg-gold-500 w-8 h-2'
                      : 'bg-gray-300 w-2 h-2 hover:bg-gold-300'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Reviews Link */}
        {totalReviews > 0 && placeId && (
          <div className="text-center mt-12">
            <a
              href={`https://search.google.com/local/writereview?placeid=${placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaGoogle />
              <span>View all {totalReviews} reviews on Google</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

