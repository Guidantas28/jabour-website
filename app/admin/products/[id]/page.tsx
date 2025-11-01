'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRequireAuth } from '@/lib/auth'
import ImageUpload from '@/components/ImageUpload'

export default function EditProductPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'engagement-rings',
    price: '',
    description: '',
    metals: '',
    diamondShapes: '',
    featured_image_url: '',
    images: '',
  })

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        category: data.category || 'engagement-rings',
        price: data.price || '',
        description: data.description || '',
        metals: Array.isArray(data.metals) ? data.metals.join(', ') : '',
        diamondShapes: Array.isArray(data.diamondShapes) ? data.diamondShapes.join(', ') : '',
        featured_image_url: data.featured_image_url || '',
        images: Array.isArray(data.images) ? data.images.join(', ') : '',
      })
    } catch (error) {
      console.error('Error fetching product:', error)
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
        .from('products')
        .update({
          ...formData,
          metals: formData.metals.split(',').map(m => m.trim()).filter(m => m),
          diamondShapes: formData.diamondShapes.split(',').map(s => s.trim()).filter(s => s),
          images: formData.images.split(',').map(img => img.trim()).filter(img => img),
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
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
        <p className="text-gray-600">Loading product...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding py-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/products" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
            ← Back to Products
          </Link>
          
          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-8">
            Edit Product
          </h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-primary-900 mb-2">
                Product Name *
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
              <label htmlFor="category" className="block text-sm font-semibold text-primary-900 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              >
                <option value="engagement-rings">Engagement Rings</option>
                <option value="wedding-rings">Wedding Rings</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-primary-900 mb-2">
                Price *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-primary-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
              <label htmlFor="metals" className="block text-sm font-semibold text-primary-900 mb-2">
                Metals (comma separated)
              </label>
              <input
                type="text"
                id="metals"
                name="metals"
                value={formData.metals}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
              <label htmlFor="diamondShapes" className="block text-sm font-semibold text-primary-900 mb-2">
                Diamond Shapes (comma separated)
              </label>
              <input
                type="text"
                id="diamondShapes"
                name="diamondShapes"
                value={formData.diamondShapes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <ImageUpload
              currentImage={formData.featured_image_url}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
              folder="products"
            />

            <div>
              <label htmlFor="images" className="block text-sm font-semibold text-primary-900 mb-2">
                Additional Images (comma separated URLs)
              </label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images}
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
                href="/admin/products"
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
