'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '@/lib/supabase'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const heroDividerRef = useRef<HTMLDivElement>(null)
  const postsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_date', { ascending: false })
          .limit(12)
        
        if (error) throw error
        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

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

      // Blog posts grid
      if (postsRef.current && !loading && posts.length > 0) {
        const postCards = postsRef.current.querySelectorAll('.blog-post-card')
        gsap.from(postCards, {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: postsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    return () => ctx.revert()
  }, [posts, loading])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 ref={heroTitleRef} className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Blog
          </h1>
          <p ref={heroSubtitleRef} className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed">
            Discover insights, guides, and stories about jewellery
          </p>
          <div ref={heroDividerRef} className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Loading posts...</p>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No blog posts available.</p>
            </div>
          ) : (
            <div ref={postsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="blog-post-card group bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all hover:border-gold-500"
                >
                  {post.featured_image_url && post.featured_image_url.trim() !== '' ? (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={post.featured_image_url.includes('supabase.co')}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-gold-500 font-light mb-2">
                      {post.published_date && new Date(post.published_date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {post.author && ` • By ${post.author}`}
                    </div>
                    <h2 className="text-2xl font-serif font-normal text-primary-900 mb-3 group-hover:text-gold-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed font-light line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
