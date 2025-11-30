'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRequireAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

interface Configuration {
  id?: string
  type: string
  value: string
  display_name: string
  price_adjustment: number
  display_order: number
  active: boolean
}

interface ProductImage {
  id?: string
  url: string
  shape: string
  metal: string
  display_order: number
  is_primary: boolean
}

interface DiamondSetting {
  id?: string
  shape: string
  min_carat: number
  max_carat: number
  allowed_colors: string[]
  allowed_clarities: string[]
  allowed_cuts: string[]
  origin: 'natural' | 'lab-grown' | 'both'
  min_price: number
  max_price: number
}

export default function EditProductPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'configurations' | 'images' | 'diamond-settings'>('basic')
  
  // Basic product info
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'engagement-rings',
    description: '',
    base_price: 0,
    featured_image_url: '',
    active: true,
    diamond_selection_mode: 'nivoda' as 'nivoda' | 'custom' | 'both',
  })

  // Configurations (metals, shapes, band styles, ring sizes)
  const [configurations, setConfigurations] = useState<Configuration[]>([])

  // Product images
  const [images, setImages] = useState<ProductImage[]>([])

  // Diamond settings
  const [diamondSettings, setDiamondSettings] = useState<DiamondSetting[]>([])

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      // Fetch product directly from Supabase by ID
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          product_configurations(*),
          product_images(*),
          product_diamond_settings(*),
          product_diamond_customization_options(*)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        throw new Error(error.message || 'Product not found')
      }

      if (!product) {
        throw new Error('Product not found')
      }

      loadProductData(product)
    } catch (error: any) {
      alert(`Error loading product: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const loadProductData = (product: any) => {
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || 'engagement-rings',
      description: product.description || '',
      base_price: product.base_price || 0,
      featured_image_url: product.featured_image_url || '',
      active: product.active !== undefined ? product.active : true,
      diamond_selection_mode: (product.diamond_selection_mode || 'nivoda') as 'nivoda' | 'custom' | 'both',
    })

    // Load configurations
    if (product.product_configurations && Array.isArray(product.product_configurations)) {
      setConfigurations(product.product_configurations.map((config: any) => ({
        id: config.id,
        type: config.configuration_type || '',
        value: config.configuration_value || '',
        display_name: config.display_name || '',
        price_adjustment: config.price_adjustment || 0,
        display_order: config.display_order || 0,
        active: config.active !== undefined ? config.active : true,
      })))
    }

    // Load images
    if (product.product_images && Array.isArray(product.product_images)) {
      setImages(product.product_images.map((img: any) => ({
        id: img.id,
        url: img.image_url || '',
        shape: img.shape || '',
        metal: img.metal || '',
        display_order: img.display_order || 0,
        is_primary: img.is_primary || false,
      })))
    }

    // Load diamond settings
    if (product.product_diamond_settings && Array.isArray(product.product_diamond_settings)) {
      setDiamondSettings(product.product_diamond_settings.map((setting: any) => ({
        id: setting.id,
        shape: setting.shape || '',
        min_carat: setting.min_carat || 0.30,
        max_carat: setting.max_carat || 10.00,
        allowed_colors: setting.allowed_colors || [],
        allowed_clarities: setting.allowed_clarities || [],
        allowed_cuts: setting.allowed_cuts || [],
        origin: setting.origin || 'both',
        min_price: setting.min_price || 0,
        max_price: setting.max_price || 100000,
      })))
    }
  }

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'base_price' ? parseFloat(value) || 0 :
              name === 'diamond_selection_mode' ? value as 'nivoda' | 'custom' | 'both' :
              value,
    }))
  }

  const addConfiguration = () => {
    setConfigurations([...configurations, {
      type: 'metal',
      value: '',
      display_name: '',
      price_adjustment: 0,
      display_order: configurations.length,
      active: true,
    }])
  }

  const updateConfiguration = (index: number, field: keyof Configuration, value: any) => {
    const updated = [...configurations]
    updated[index] = { ...updated[index], [field]: value }
    setConfigurations(updated)
  }

  const removeConfiguration = (index: number) => {
    setConfigurations(configurations.filter((_, i) => i !== index))
  }

  const addImage = () => {
    setImages([...images, {
      url: '',
      shape: '',
      metal: '',
      display_order: images.length,
      is_primary: false,
    }])
  }

  const updateImage = (index: number, field: keyof ProductImage, value: any) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    setImages(updated)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addDiamondSetting = () => {
    setDiamondSettings([...diamondSettings, {
      shape: '',
      min_carat: 0.30,
      max_carat: 10.00,
      allowed_colors: [],
      allowed_clarities: [],
      allowed_cuts: [],
      origin: 'both',
      min_price: 0,
      max_price: 100000,
    }])
  }

  const updateDiamondSetting = (index: number, field: keyof DiamondSetting, value: any) => {
    const updated = [...diamondSettings]
    updated[index] = { ...updated[index], [field]: value }
    setDiamondSettings(updated)
  }

  const removeDiamondSetting = (index: number) => {
    setDiamondSettings(diamondSettings.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // First get the slug to use in the API
      const slug = formData.slug
      
      const response = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          category: formData.category,
          description: formData.description,
          base_price: formData.base_price,
          featured_image_url: formData.featured_image_url,
          active: formData.active,
          diamond_selection_mode: formData.diamond_selection_mode,
          configurations: configurations.filter(c => c.value && c.display_name),
          images: images.filter(img => img.url),
          diamond_settings: diamondSettings.filter(ds => ds.shape),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product')
      }

      router.push('/admin/products')
    } catch (error: any) {
      alert(`Error updating product: ${error.message || 'Unknown error'}`)
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
        <div className="max-w-5xl mx-auto">
          <Link href="/admin/products" className="text-sm text-gray-600 hover:text-primary-800 mb-4 inline-block">
            ← Back to Products
          </Link>
          
          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-8">
            Edit Product
          </h1>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-gray-200">
            {(['basic', 'configurations', 'images', 'diamond-settings'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-900 text-primary-900'
                    : 'text-gray-600 hover:text-primary-800'
                }`}
              >
                {tab === 'basic' && 'Basic Info'}
                {tab === 'configurations' && 'Configurations'}
                {tab === 'images' && 'Images'}
                {tab === 'diamond-settings' && 'Diamond Settings'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-primary-900 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                      onChange={handleBasicChange}
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
                      onChange={handleBasicChange}
                required
                      placeholder="e.g., classic-solitaire"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
                  </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-primary-900 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                    onChange={handleBasicChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              >
                <option value="engagement-rings">Engagement Rings</option>
                <option value="wedding-rings">Wedding Rings</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>

            <div>
                  <label htmlFor="base_price" className="block text-sm font-semibold text-primary-900 mb-2">
                    Base Price (£) *
              </label>
              <input
                    type="number"
                    id="base_price"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleBasicChange}
                required
                    min="0"
                    step="0.01"
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
                    onChange={handleBasicChange}
                required
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
              />
            </div>

            <div>
                  <label htmlFor="diamond_selection_mode" className="block text-sm font-semibold text-primary-900 mb-2">
                    Diamond Selection Mode *
                  </label>
                  <select
                    id="diamond_selection_mode"
                    name="diamond_selection_mode"
                    value={formData.diamond_selection_mode}
                    onChange={handleBasicChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-primary-800 focus:border-primary-800"
                  >
                    <option value="nivoda">Nivoda (API Selection Only)</option>
                    <option value="custom">Custom (Manual Selection Only)</option>
                    <option value="both">Both (Nivoda API + Custom)</option>
                  </select>
                </div>

                <div>
                  <ImageUpload
                    currentImage={formData.featured_image_url}
                    onImageUploaded={(url) => setFormData(prev => ({ ...prev, featured_image_url: url }))}
                    folder="products"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleBasicChange}
                    className="h-4 w-4 text-primary-800 focus:ring-primary-800 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Active (visible on website)
                  </label>
                </div>
              </div>
            )}

            {/* Configurations Tab */}
            {activeTab === 'configurations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-900">Product Configurations</h3>
                  <button
                    type="button"
                    onClick={addConfiguration}
                    className="px-4 py-2 bg-primary-900 text-white rounded-sm text-sm hover:bg-primary-800"
                  >
                    + Add Configuration
                  </button>
                </div>

                <div className="space-y-4">
                  {configurations.map((config, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-primary-900">Configuration {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeConfiguration(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Type *
                          </label>
                          <select
                            value={config.type}
                            onChange={(e) => updateConfiguration(index, 'type', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            required
                          >
                            <option value="metal">Metal</option>
                            <option value="shape">Shape</option>
                            <option value="band_style">Band Style</option>
                            <option value="ring_size">Ring Size</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Value *
                          </label>
                          <input
                            type="text"
                            value={config.value}
                            onChange={(e) => updateConfiguration(index, 'value', e.target.value)}
                            placeholder="e.g., platinum, round, plain"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Display Name *
                          </label>
                          <input
                            type="text"
                            value={config.display_name}
                            onChange={(e) => updateConfiguration(index, 'display_name', e.target.value)}
                            placeholder="e.g., Platinum, Round, Plain Band"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Price Adjustment (£)
                          </label>
                          <input
                            type="number"
                            value={config.price_adjustment}
                            onChange={(e) => updateConfiguration(index, 'price_adjustment', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={config.display_order}
                            onChange={(e) => updateConfiguration(index, 'display_order', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div className="flex items-center pt-6">
                          <input
                            type="checkbox"
                            checked={config.active}
                            onChange={(e) => updateConfiguration(index, 'active', e.target.checked)}
                            className="h-4 w-4 text-primary-800 focus:ring-primary-800 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {configurations.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No configurations added. Click "Add Configuration" to get started.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-900">Product Images</h3>
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-primary-900 text-white rounded-sm text-sm hover:bg-primary-800"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-primary-900">Image {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Image URL *
                          </label>
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => updateImage(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Shape (optional)
                          </label>
                          <input
                            type="text"
                            value={image.shape}
                            onChange={(e) => updateImage(index, 'shape', e.target.value)}
                            placeholder="e.g., round, oval"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Metal (optional)
                          </label>
                          <input
                            type="text"
                            value={image.metal}
                            onChange={(e) => updateImage(index, 'metal', e.target.value)}
                            placeholder="e.g., platinum, 18k-white-gold"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={image.display_order}
                            onChange={(e) => updateImage(index, 'display_order', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={image.is_primary}
                            onChange={(e) => updateImage(index, 'is_primary', e.target.checked)}
                            className="h-4 w-4 text-primary-800 focus:ring-primary-800 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            Primary Image (for this shape/metal combination)
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  {images.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No images added. Click "Add Image" to get started.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Diamond Settings Tab */}
            {activeTab === 'diamond-settings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-900">Diamond Settings</h3>
                  <button
                    type="button"
                    onClick={addDiamondSetting}
                    className="px-4 py-2 bg-primary-900 text-white rounded-sm text-sm hover:bg-primary-800"
                  >
                    + Add Diamond Setting
                  </button>
                </div>

                <div className="space-y-4">
                  {diamondSettings.map((setting, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-primary-900">Diamond Setting {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeDiamondSetting(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Shape (optional)
              </label>
              <input
                type="text"
                            value={setting.shape}
                            onChange={(e) => updateDiamondSetting(index, 'shape', e.target.value)}
                            placeholder="e.g., round, oval"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Origin
                          </label>
                          <select
                            value={setting.origin}
                            onChange={(e) => updateDiamondSetting(index, 'origin', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          >
                            <option value="both">Both (Natural & Lab-Grown)</option>
                            <option value="natural">Natural Only</option>
                            <option value="lab-grown">Lab-Grown Only</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Min Carat
                          </label>
                          <input
                            type="number"
                            value={setting.min_carat}
                            onChange={(e) => updateDiamondSetting(index, 'min_carat', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Max Carat
                          </label>
                          <input
                            type="number"
                            value={setting.max_carat}
                            onChange={(e) => updateDiamondSetting(index, 'max_carat', parseFloat(e.target.value) || 10)}
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Allowed Colors (comma separated)
              </label>
              <input
                type="text"
                            value={setting.allowed_colors.join(', ')}
                            onChange={(e) => updateDiamondSetting(index, 'allowed_colors', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                            placeholder="e.g., D, E, F, G, H"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Allowed Clarities (comma separated)
                          </label>
                          <input
                            type="text"
                            value={setting.allowed_clarities.join(', ')}
                            onChange={(e) => updateDiamondSetting(index, 'allowed_clarities', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                            placeholder="e.g., IF, VVS1, VVS2, VS1"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
                        </div>

            <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Allowed Cuts (comma separated)
              </label>
              <input
                type="text"
                            value={setting.allowed_cuts.join(', ')}
                            onChange={(e) => updateDiamondSetting(index, 'allowed_cuts', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                            placeholder="e.g., Excellent, Very Good"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Min Price (£)
                          </label>
                          <input
                            type="number"
                            value={setting.min_price}
                            onChange={(e) => updateDiamondSetting(index, 'min_price', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

                        <div>
                          <label className="block text-sm font-semibold text-primary-900 mb-2">
                            Max Price (£)
                          </label>
                          <input
                            type="number"
                            value={setting.max_price}
                            onChange={(e) => updateDiamondSetting(index, 'max_price', parseFloat(e.target.value) || 100000)}
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {diamondSettings.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No diamond settings added. Click "Add Diamond Setting" to get started.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
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
