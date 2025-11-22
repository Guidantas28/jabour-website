'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { addToCart } from '@/lib/cart'
import { showSuccess } from '@/components/Toast'

interface ProductSelections {
  metal: string
  bandStyle: string
  shape?: string
  selectedDiamond?: string
  ringSize?: string
}

interface Diamond {
  id: string
  diamond?: {
    id: string
    image?: string
    video?: string
    certificate?: {
      id: string
      lab?: string
      shape?: string
      certNumber: string
      carats: number
      color?: string
      clarity?: string
      cut?: string
    }
  }
  price?: number
  discount?: number
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  base_price: number
  featured_image_url: string
  product_configurations: Array<{
    id: string
    configuration_type: string
    configuration_value: string
    display_name: string
    price_adjustment: number
    display_order: number
    metadata: any
    active?: boolean
  }>
  product_images: Array<{
    id: string
    image_url: string
    shape: string | null
    metal: string | null
    display_order: number
    is_primary: boolean
  }>
  product_diamond_settings: Array<{
    id: string
    shape: string | null
    min_carat: number
    max_carat: number
    allowed_colors: string[] | null
    allowed_clarities: string[] | null
    allowed_cuts: string[] | null
    origin: string
    min_price: number
    max_price: number
  }>
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Helper function to proxy video URLs through our API to avoid CORS issues
function getProxiedVideoUrl(videoUrl: string | undefined): string | undefined {
  if (!videoUrl) return undefined
  if (videoUrl.includes('loupe360.com')) {
    return `/api/video-proxy?url=${encodeURIComponent(videoUrl)}`
  }
  return videoUrl
}

function DynamicProductContent({ params }: ProductPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [availableDiamonds, setAvailableDiamonds] = useState<Diamond[]>([])
  const [isLoadingDiamonds, setIsLoadingDiamonds] = useState(false)
  const [diamondError, setDiamondError] = useState<string | null>(null)
  const [diamondOffset, setDiamondOffset] = useState(0)
  const [hasMoreDiamonds, setHasMoreDiamonds] = useState(false)
  const [totalDiamonds, setTotalDiamonds] = useState(0)
  const [showCartModal, setShowCartModal] = useState(false)
  const [selectedDiamondDetail, setSelectedDiamondDetail] = useState<Diamond | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'carat-asc' | 'carat-desc'>('price-asc')
  
  // Diamond filter states
  const [diamondFilters, setDiamondFilters] = useState({
    colors: [] as string[],
    clarities: [] as string[],
    cuts: [] as string[],
    minCarat: undefined as number | undefined,
    maxCarat: undefined as number | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    origin: 'both' as 'natural' | 'lab-grown' | 'both',
  })

  // Get configurations from product
  const metals = product?.product_configurations
    .filter(c => c.configuration_type === 'metal' && (c.active !== false))
    .sort((a, b) => {
      // Prioritize 18k metals first
      const aIs18k = a.configuration_value?.includes('18k') || a.display_name?.includes('18k')
      const bIs18k = b.configuration_value?.includes('18k') || b.display_name?.includes('18k')
      
      if (aIs18k && !bIs18k) return -1
      if (!aIs18k && bIs18k) return 1
      
      // If both are same type (both 18k or both 9k), sort by display_order
      return a.display_order - b.display_order
    })
    .map(c => ({
      id: c.configuration_value,
      name: c.display_name,
      priceAdjustment: c.price_adjustment,
      metadata: c.metadata || {},
    })) || []

  const diamondShapes = product?.product_configurations
    .filter(c => c.configuration_type === 'shape' && (c.active !== false))
    .sort((a, b) => a.display_order - b.display_order)
    .map(c => ({
      id: c.configuration_value,
      name: c.display_name,
      icon: c.metadata?.icon || '/images/diamonds/round.png',
    })) || []

  const bandStyles = product?.product_configurations
    .filter(c => c.configuration_type === 'band_style' && (c.active !== false))
    .sort((a, b) => a.display_order - b.display_order)
    .map(c => ({
      id: c.configuration_value,
      name: c.display_name,
      description: c.metadata?.description || '',
      icon: c.metadata?.icon || 'plain',
    })) || []

  const ringSizes = product?.product_configurations
    .filter(c => c.configuration_type === 'ring_size' && (c.active !== false))
    .sort((a, b) => a.display_order - b.display_order)
    .map(c => c.configuration_value) || []

  // Default selections
  const defaultSelections: ProductSelections = {
    metal: metals[0]?.id || '',
    bandStyle: bandStyles[0]?.id || '',
    ringSize: ringSizes.find(s => s === 'M') || ringSizes[0] || '',
  }

  // Initialize selections from URL params or defaults
  const getInitialSelections = (): ProductSelections => {
    const shape = searchParams?.get('shape') || undefined
    const metal = searchParams?.get('metal') || defaultSelections.metal
    const bandStyle = searchParams?.get('bandStyle') || defaultSelections.bandStyle
    const selectedDiamond = searchParams?.get('selectedDiamond') || undefined
    const ringSize = searchParams?.get('ringSize') || defaultSelections.ringSize

    return {
      metal,
      bandStyle,
      shape,
      selectedDiamond,
      ringSize,
    }
  }

  const [selections, setSelections] = useState<ProductSelections>(getInitialSelections)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = await response.json()
        setProduct(data.product)
        
        // Update default selections with product data
        const initialSelections = getInitialSelections()
        setSelections(initialSelections)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  // Sync URL with selections
  useEffect(() => {
    if (!product) return
    
    const params = new URLSearchParams()
    if (selections.metal) params.set('metal', selections.metal)
    if (selections.bandStyle) params.set('bandStyle', selections.bandStyle)
    if (selections.shape) params.set('shape', selections.shape)
    if (selections.selectedDiamond) params.set('selectedDiamond', selections.selectedDiamond)
    if (selections.ringSize) params.set('ringSize', selections.ringSize)

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [selections, product])

  // Fetch images based on shape and metal
  const [images, setImages] = useState<string[]>([])
  
  useEffect(() => {
    const fetchImages = async () => {
      if (!product) return
      
      try {
        const params = new URLSearchParams()
        if (selections.shape) params.set('shape', selections.shape)
        if (selections.metal) params.set('metal', selections.metal)
        
        const response = await fetch(`/api/products/${product.slug}/images?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          const imageUrls = data.images.map((img: any) => img.image_url)
          setImages(imageUrls.length > 0 ? imageUrls : [product.featured_image_url])
          setMainImageIndex(0)
        } else {
          setImages([product.featured_image_url])
        }
      } catch (error) {
        setImages([product.featured_image_url])
      }
    }

    fetchImages()
  }, [product, selections.shape, selections.metal])

  // Search diamonds when shape is selected
  useEffect(() => {
    if (selections.shape && product) {
      searchDiamondsFromAPI(selections.shape, selections)
    }
  }, [selections.shape, product])

  const updateSelection = (key: keyof ProductSelections, value: any) => {
    setSelections((prev) => {
      const newSelections = { ...prev, [key]: value }
      
      if (key === 'shape' && value) {
        setTimeout(() => {
          searchDiamondsFromAPI(value as string, newSelections)
        }, 0)
      }
      
      return newSelections
    })
  }

  const searchDiamondsFromAPI = async (shape: string, currentSelections: ProductSelections, loadMore: boolean = false) => {
    if (!product) return
    
    setIsLoadingDiamonds(true)
    setDiamondError(null)
    
    if (!loadMore) {
      setAvailableDiamonds([])
      setDiamondOffset(0)
    }
    
    try {
      const currentOffset = loadMore ? diamondOffset : 0
      // Send ONLY shape to API - no filters! All filters will be applied client-side
      // This ensures we get all diamonds (including cheaper ones) and let the user filter
      const params = new URLSearchParams({
        shape: shape,
        limit: '50',
        offset: currentOffset.toString(),
      })
      
      const response = await fetch(`/api/nivoda/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to search diamonds')
      }
      
      const data = await response.json()
      
      // Start with all diamonds that have images
      // NOTE: Origin filter removed because diamondType field is not available in API
      const diamondsWithImages = (data.diamonds || [])
        .filter((d: Diamond) => d.diamond?.image)
        .sort((a: Diamond, b: Diamond) => {
          const priceA = a.price || 0
          const priceB = b.price || 0
          return priceA - priceB
        })
      
      // Update offset based on what we received from API, not filtered results
      const diamondsReceivedFromAPI = (data.diamonds || []).length
      
      if (loadMore) {
        setAvailableDiamonds(prev => [...prev, ...diamondsWithImages])
        setDiamondOffset(prev => prev + diamondsReceivedFromAPI)
      } else {
        setAvailableDiamonds(diamondsWithImages)
        setDiamondOffset(diamondsReceivedFromAPI)
      }
      
      // Use API's hasMore flag - this tells us if there are more diamonds in the API
      // regardless of how many passed our client-side filters
      if (data.hasMore !== undefined) {
        setHasMoreDiamonds(data.hasMore)
      } else {
        // If API doesn't provide hasMore, check if we got a full page (50 diamonds)
        // This means there might be more available
        setHasMoreDiamonds(diamondsReceivedFromAPI === 50)
      }
      
      if (data.total_count !== undefined) {
        setTotalDiamonds(data.total_count)
      }
    } catch (error: any) {
      setDiamondError(error.message || 'Failed to load diamonds. Please try again.')
    } finally {
      setIsLoadingDiamonds(false)
    }
  }
  
  const loadMoreDiamonds = () => {
    if (selections.shape && !isLoadingDiamonds) {
      searchDiamondsFromAPI(selections.shape, selections, true)
    }
  }

  // Calculate price
  const selectedMetal = metals.find((m) => m.id === selections.metal)
  const selectedBandStyle = bandStyles.find((b) => b.id === selections.bandStyle)
  const selectedDiamond = availableDiamonds.find((d) => d.id === selections.selectedDiamond)

  const settingPrice = (product?.base_price || 0) + (selectedMetal?.priceAdjustment || 0)
  const diamondPrice = selectedDiamond?.price || 0
  const totalPrice = settingPrice + diamondPrice

  const handleAddToCart = () => {
    if (!selections.shape) {
      showSuccess('Please select a diamond shape first')
      return
    }
    if (!selections.selectedDiamond) {
      showSuccess('Please select a diamond first')
      return
    }

    const cartProduct = {
      id: `${product?.slug}-${selections.selectedDiamond}-${selections.metal}-${selections.bandStyle}-${selections.ringSize}`,
      name: product?.name || '',
      price: totalPrice,
      image: images[0] || product?.featured_image_url || '',
      metal: selectedMetal?.name || selections.metal,
      diamondShape: selections.shape,
      customizations: {
        metal: selectedMetal?.name || selections.metal,
        bandStyle: selectedBandStyle?.name || selections.bandStyle,
        ringSize: selections.ringSize,
        shape: selections.shape,
        diamond: selectedDiamond ? {
          id: selectedDiamond.id,
          carat: selectedDiamond.diamond?.certificate?.carats,
          color: selectedDiamond.diamond?.certificate?.color,
          clarity: selectedDiamond.diamond?.certificate?.clarity,
          cut: selectedDiamond.diamond?.certificate?.cut,
          lab: selectedDiamond.diamond?.certificate?.lab,
        } : undefined,
      },
    }

    addToCart(cartProduct)
    window.dispatchEvent(new Event('cartUpdated'))
    setShowCartModal(true)
  }

  const mainImage = images[mainImageIndex] || images[0] || product?.featured_image_url

  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-900 mb-4">Product not found</h1>
          <Link href="/engagement-rings" className="text-primary-800 hover:underline">
            Back to Engagement Rings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container-custom">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-800">Home</Link>
            {' / '}
            <Link href="/engagement-rings" className="hover:text-primary-800">Engagement Rings</Link>
            {' / '}
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Product Images */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  quality={100}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                    {mainImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative hover:opacity-80 transition-opacity border-2 ${
                      mainImageIndex === index ? 'border-gold-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="object-cover"
                      quality={100}
                      sizes="(max-width: 768px) 25vw, 25vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Customization */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-serif font-bold text-primary-900 mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-semibold text-primary-800 mb-4">
              Setting Price: £{settingPrice.toLocaleString()}
            </p>
            {selectedDiamond && (
              <p className="text-lg font-semibold text-primary-800 mb-4">
                Diamond Price: £{diamondPrice.toLocaleString()}
              </p>
            )}
            <p className="text-lg font-bold text-primary-900 mb-4">
              Total: £{totalPrice.toLocaleString()}
            </p>
            {product.description && (
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Diamond Shape Selection */}
            {diamondShapes.length > 0 && (
              <div className="mb-4 border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-primary-900">
                    Diamond Shape: <span className="font-normal text-gold-500">
                      {selections.shape ? diamondShapes.find(s => s.id === selections.shape)?.name || selections.shape : 'Select a shape'}
                    </span>
                  </h3>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {diamondShapes.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => updateSelection('shape', shape.id)}
                      className="flex flex-col items-center gap-1 transition-all group relative"
                    >
                      <div className="w-8 h-8 flex items-center justify-center relative">
                        <Image
                          src={shape.icon}
                          alt={shape.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      {selections.shape === shape.id && (
                        <div className="w-8 h-0.5 bg-primary-900"></div>
                      )}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                        {shape.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </button>
                  ))}
                </div>
                {selections.shape && (
                  <>
                    <button
                      onClick={() => {
                        setTimeout(() => {
                          document.getElementById('diamond-selection-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }, 100)
                      }}
                      className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-sm transition-colors text-sm mb-4"
                    >
                      SELECT DIAMOND
                    </button>
                    {selectedDiamond && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          {selectedDiamond.diamond?.image && (
                            <div className="w-16 h-16 flex-shrink-0 bg-white rounded overflow-hidden border border-gray-200">
                              <Image
                                src={selectedDiamond.diamond.image.replace('500/500', '150/150')}
                                alt="Selected Diamond"
                                width={150}
                                height={150}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-primary-900 mb-1">
                              {selectedDiamond.diamond?.certificate?.carats?.toFixed(2)}ct {selectedDiamond.diamond?.certificate?.shape || selections.shape}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              {[
                                selectedDiamond.diamond?.certificate?.color,
                                selectedDiamond.diamond?.certificate?.clarity,
                                selectedDiamond.diamond?.certificate?.cut
                              ].filter(Boolean).join(', ')}
                            </p>
                            {selectedDiamond.price && (
                              <p className="text-sm font-bold text-primary-900">
                                £{selectedDiamond.price.toLocaleString()}
                              </p>
                            )}
                            {selectedDiamond.diamond?.certificate?.lab && (
                              <p className="text-[10px] text-gray-500 uppercase mt-1">
                                {selectedDiamond.diamond.certificate.lab} Certified
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Metal Selection */}
            {metals.length > 0 && (
              <div className="mb-4 border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-primary-900 mb-2">
                  Metal: <span className="font-normal text-gold-500">
                    {selectedMetal?.name || 'Select a metal'}
                  </span>
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {metals.map((metal) => (
                    <button
                      key={metal.id}
                      onClick={() => updateSelection('metal', metal.id)}
                      className={`px-4 py-2 rounded-sm border-2 transition-all text-sm font-medium ${
                        selections.metal === metal.id
                          ? 'border-primary-900 bg-primary-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-primary-800'
                      }`}
                    >
                      {metal.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Band Style Selection */}
            {bandStyles.length > 0 && (
              <div className="mb-4 border-b border-gray-200 pb-4">
                <h3 className="text-sm font-semibold text-primary-900 mb-2">
                  Band Style: <span className="font-normal text-gold-500">
                    {selectedBandStyle?.name || 'Select a style'}
                  </span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {bandStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateSelection('bandStyle', style.id)}
                      className={`p-3 rounded-sm border-2 transition-all text-left ${
                        selections.bandStyle === style.id
                          ? 'border-primary-900 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                      }`}
                    >
                      <p className="text-sm font-semibold text-primary-900 mb-1">
                        {style.name}
                      </p>
                      {style.description && (
                        <p className="text-xs text-gray-600">
                          {style.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ring Size Selection */}
            {ringSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-primary-900 mb-2">
                  Ring Size: <span className="font-normal text-gold-500">
                    {selections.ringSize || 'Select a size'}
                  </span>
                </h3>
                <div className="grid grid-cols-8 gap-2">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSelection('ringSize', size)}
                      className={`px-3 py-2 rounded-sm border-2 transition-all text-sm ${
                        selections.ringSize === size
                          ? 'border-primary-900 bg-primary-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-primary-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selections.shape || !selections.selectedDiamond}
              className="w-full bg-primary-900 hover:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-sm transition-colors mb-4"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Diamond Selection Section */}
        {selections.shape && (
          <div id="diamond-selection-section" className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">
              Select Your Diamond
            </h2>
            
            {/* Filters and View Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-sm border-2 transition-all ${
                    viewMode === 'grid' ? 'border-primary-900 bg-primary-900 text-white' : 'border-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-sm border-2 transition-all ${
                    viewMode === 'list' ? 'border-primary-900 bg-primary-900 text-white' : 'border-gray-300'
                  }`}
                >
                  List
                </button>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-sm"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="carat-asc">Carat: Low to High</option>
                <option value="carat-desc">Carat: High to Low</option>
              </select>
            </div>

            {/* Diamond Grid/List */}
            {isLoadingDiamonds && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading diamonds...</p>
              </div>
            )}

            {diamondError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{diamondError}</p>
              </div>
            )}

            {!isLoadingDiamonds && availableDiamonds.length === 0 && selections.shape && (
              <div className="text-center py-12">
                <p className="text-gray-600">No diamonds found. Please try adjusting your filters.</p>
              </div>
            )}

            {viewMode === 'grid' && availableDiamonds.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {availableDiamonds.map((diamond) => (
                  <button
                    key={diamond.id}
                    onClick={() => {
                      updateSelection('selectedDiamond', diamond.id)
                      setSelectedDiamondDetail(diamond)
                    }}
                    className={`bg-white border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                      selections.selectedDiamond === diamond.id ? 'border-primary-900' : 'border-gray-200'
                    }`}
                  >
                    {diamond.diamond?.image && (
                      <div className="aspect-square bg-gray-100 relative">
                        <Image
                          src={diamond.diamond.image.replace('500/500', '300/300')}
                          alt="Diamond"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-primary-900 mb-1">
                        {diamond.diamond?.certificate?.carats?.toFixed(2)}ct
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {[
                          diamond.diamond?.certificate?.color,
                          diamond.diamond?.certificate?.clarity,
                          diamond.diamond?.certificate?.cut
                        ].filter(Boolean).join(', ')}
                      </p>
                      {diamond.price && (
                        <p className="text-sm font-bold text-primary-900">
                          £{diamond.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {viewMode === 'list' && availableDiamonds.length > 0 && (
              <div className="space-y-4 mb-6">
                {availableDiamonds.map((diamond) => (
                  <button
                    key={diamond.id}
                    onClick={() => {
                      updateSelection('selectedDiamond', diamond.id)
                      setSelectedDiamondDetail(diamond)
                    }}
                    className={`w-full bg-white border-2 rounded-lg p-4 flex gap-4 transition-all hover:shadow-lg ${
                      selections.selectedDiamond === diamond.id ? 'border-primary-900' : 'border-gray-200'
                    }`}
                  >
                    {diamond.diamond?.image && (
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={diamond.diamond.image.replace('500/500', '200/200')}
                          alt="Diamond"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-primary-900 mb-1">
                        {diamond.diamond?.certificate?.carats?.toFixed(2)}ct {diamond.diamond?.certificate?.shape || selections.shape}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {[
                          diamond.diamond?.certificate?.color,
                          diamond.diamond?.certificate?.clarity,
                          diamond.diamond?.certificate?.cut
                        ].filter(Boolean).join(', ')}
                      </p>
                      {diamond.price && (
                        <p className="text-sm font-bold text-primary-900">
                          £{diamond.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMoreDiamonds && !isLoadingDiamonds && (
              <div className="text-center">
                <button
                  onClick={loadMoreDiamonds}
                  className="px-6 py-3 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-sm transition-colors"
                >
                  Load More Diamonds
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diamond Details Modal */}
      {selectedDiamondDetail && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedDiamondDetail(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-primary-900">Diamond Details</h3>
              <button
                onClick={() => setSelectedDiamondDetail(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Diamond Image */}
                <div className="bg-gray-100 rounded-lg aspect-square relative overflow-hidden">
                  {selectedDiamondDetail.diamond?.image ? (
                    <Image
                      src={selectedDiamondDetail.diamond.image.replace('500/500', '800/800')}
                      alt="Diamond"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-primary-800 rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Diamond Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-primary-900 mb-2">Specifications</h4>
                    <div className="space-y-2 text-sm">
                      {selectedDiamondDetail.diamond?.certificate?.carats && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carat Weight:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.carats.toFixed(2)}ct
                          </span>
                        </div>
                      )}
                      {selectedDiamondDetail.diamond?.certificate?.shape && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shape:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.shape}
                          </span>
                        </div>
                      )}
                      {selectedDiamondDetail.diamond?.certificate?.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.color}
                          </span>
                        </div>
                      )}
                      {selectedDiamondDetail.diamond?.certificate?.clarity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Clarity:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.clarity}
                          </span>
                        </div>
                      )}
                      {selectedDiamondDetail.diamond?.certificate?.cut && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cut:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.cut}
                          </span>
                        </div>
                      )}
                      {selectedDiamondDetail.diamond?.certificate?.lab && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certification Lab:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.lab}
                          </span>
                        </div>
                      )}
                      {selectedDiamondDetail.diamond?.certificate?.certNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate Number:</span>
                          <span className="font-semibold text-primary-900">
                            {selectedDiamondDetail.diamond.certificate.certNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    {selectedDiamondDetail.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-600">Price:</span>
                        <span className="text-2xl font-bold text-primary-900">
                          £{selectedDiamondDetail.price.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedDiamondDetail.discount && selectedDiamondDetail.discount > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-green-600 font-semibold">
                          Save £{selectedDiamondDetail.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        updateSelection('selectedDiamond', selectedDiamondDetail.id)
                        setSelectedDiamondDetail(null)
                      }}
                      className="w-full px-6 py-3 bg-primary-900 hover:bg-primary-800 text-white font-semibold rounded-sm transition-colors"
                    >
                      Select This Diamond
                    </button>
                  </div>
                </div>
              </div>

              {/* Video if available */}
              {selectedDiamondDetail.diamond?.video && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-primary-900 mb-3">Diamond Video</h4>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                    <video
                      key={selectedDiamondDetail.diamond.video}
                      src={getProxiedVideoUrl(selectedDiamondDetail.diamond.video)}
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                              <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p class="text-sm text-center">Vídeo não disponível</p>
                              <p class="text-xs text-gray-400 mt-1 text-center">O vídeo pode estar indisponível ou bloqueado por políticas de segurança</p>
                            </div>
                          `.trim()
                        }
                      }}
                    >
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCartModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-primary-900 mb-4">Added to Cart</h3>
            <p className="text-gray-700 mb-6">Your item has been added to the cart successfully.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCartModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setShowCartModal(false)
                  router.push('/checkout')
                }}
                className="flex-1 px-4 py-2 bg-primary-900 text-white rounded-sm hover:bg-primary-800"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DynamicProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DynamicProductContent params={params} />
    </Suspense>
  )
}



