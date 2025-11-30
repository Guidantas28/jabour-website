'use client'

import { useState, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'
import { FaGoogle } from 'react-icons/fa'

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

  useEffect(() => {
    fetchReviews()
  }, [])

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

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-gray-50">
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.slice(0, 3).map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < review.rating
                        ? 'text-gold-500'
                        : 'text-gray-300'
                    }`}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4 font-light">
                "{typeof review.text === 'string' ? review.text : String(review.text || '')}"
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="font-semibold text-primary-900">
                    {typeof review.author_name === 'string' ? review.author_name : String(review.author_name || 'Anonymous')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.time)}
                  </p>
                </div>
                <FaGoogle className="text-gold-500" />
              </div>
            </div>
          ))}
        </div>

        {totalReviews > 3 && (
          <div className="text-center mt-12">
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${placeId || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-semibold transition-colors"
            >
              <FaGoogle />
              <span>View all reviews on Google</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

