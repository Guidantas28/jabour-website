import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    notFound()
  }

  const post = data

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="container-custom max-w-5xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-800">Home</Link>
            {' / '}
            <Link href="/blog" className="hover:text-primary-800">Blog</Link>
            {' / '}
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-white pt-20 pb-16">
        <div className="container-custom max-w-5xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-800 mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          
          <div className="text-sm text-gold-500 font-light mb-4">
            {post.published_date && new Date(post.published_date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {post.author && ` • By ${post.author}`}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl font-light text-gray-700 leading-relaxed italic">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image_url && post.featured_image_url.trim() !== '' ? (
        <section className="section-padding bg-white pt-0 pb-12">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="relative h-96 md:h-[600px] rounded-sm overflow-hidden bg-gray-100">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized={post.featured_image_url.includes('supabase.co')}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-white pt-0 pb-12">
          <div className="container-custom max-w-5xl mx-auto">
            <div className="relative h-96 md:h-[600px] rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No featured image</p>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="section-padding bg-white pb-24">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed font-light text-lg whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
          </div>
          
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-serif font-normal text-primary-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
