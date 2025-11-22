'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRequireAuth } from '@/lib/auth'
import ImageUpload from '@/components/ImageUpload'

export default function EditBlogPostPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    author: 'Jabour Team',
    published_date: new Date().toISOString().split('T')[0],
    status: 'draft',
    tags: '',
  })

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        featured_image_url: data.featured_image_url || '',
        author: data.author || 'Jabour Team',
        published_date: data.published_date || new Date().toISOString().split('T')[0],
        status: data.status || 'draft',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/admin/blog')
    } catch (error) {
      alert('Error updating post')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading post...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/blog" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
            ← Back to Blog Posts
          </Link>
          
          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-8">
            Edit Blog Post
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-primary-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-primary-900 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold text-primary-900 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-primary-900 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={12}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800 font-mono text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="author" className="block text-sm font-semibold text-primary-900 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                />
              </div>

              <div>
                <label htmlFor="published_date" className="block text-sm font-semibold text-primary-900 mb-2">
                  Published Date
                </label>
                <input
                  type="date"
                  id="published_date"
                  name="published_date"
                  value={formData.published_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-primary-900 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <ImageUpload
              currentImage={formData.featured_image_url}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
              folder="blog"
            />

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-primary-900 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-sm font-semibold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/blog"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-sm font-semibold"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
