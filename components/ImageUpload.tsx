'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string
  onImageUploaded: (url: string) => void
  folder?: 'products' | 'blog' | 'general'
  className?: string
}

export default function ImageUpload({
  currentImage,
  onImageUploaded,
  folder = 'general',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      console.log('Image uploaded successfully:', publicUrl) // Debug log
      setPreview(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error: any) {
      setError(error.message || 'Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageUploaded('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-semibold text-primary-900 mb-2">
        Featured Image
      </label>

      {preview && (
        <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={preview.includes('supabase.co')}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="cursor-pointer bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {currentImage && !preview && (
          <span className="text-sm text-gray-600">Current image: {currentImage}</span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {preview && (
        <input
          type="hidden"
          value={preview}
          name="featured_image_url"
        />
      )}
    </div>
  )
}

