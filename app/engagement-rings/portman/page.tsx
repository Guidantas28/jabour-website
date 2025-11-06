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

const metals = [
  { 
    id: '9k-white-gold', 
    name: '9k White Gold', 
    color: '#e8e8e8', 
    gradient: 'radial-gradient(circle at 30% 30%, #f5f5f5 0%, #e8e8e8 40%, #d4d4d4 80%, #c0c0c0 100%)',
    priceAdjustment: 0 
  },
  { 
    id: '9k-yellow-gold', 
    name: '9k Yellow Gold', 
    color: '#d4af37', 
    gradient: 'radial-gradient(circle at 30% 30%, #f4e4bc 0%, #e6c866 30%, #d4af37 60%, #b8941f 100%)',
    priceAdjustment: 0 
  },
  { 
    id: '9k-rose-gold', 
    name: '9k Rose Gold', 
    color: '#e8b4a0', 
    gradient: 'radial-gradient(circle at 30% 30%, #f5d5c8 0%, #e8b4a0 40%, #d49a7a 80%, #c08560 100%)',
    priceAdjustment: 0 
  },
  { 
    id: '18k-white-gold', 
    name: '18k White Gold', 
    color: '#f0f0f0', 
    gradient: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 80%, #d0d0d0 100%)',
    priceAdjustment: 100 
  },
  { 
    id: '18k-yellow-gold', 
    name: '18k Yellow Gold', 
    color: '#ffd700', 
    gradient: 'radial-gradient(circle at 30% 30%, #fff9e6 0%, #ffed4e 30%, #ffd700 60%, #e6c200 100%)',
    priceAdjustment: 150 
  },
  { 
    id: '18k-rose-gold', 
    name: '18k Rose Gold', 
    color: '#e8b4a0', 
    gradient: 'radial-gradient(circle at 30% 30%, #f5d5c8 0%, #e8b4a0 40%, #d49a7a 80%, #c08560 100%)',
    priceAdjustment: 150 
  },
  { 
    id: 'platinum', 
    name: 'Platinum', 
    color: '#e5e4e2', 
    gradient: 'radial-gradient(circle at 30% 30%, #f5f5f5 0%, #e5e4e2 40%, #d4d3d1 80%, #c3c2c0 100%)',
    priceAdjustment: 200 
  },
]

const bandStyles = [
  { 
    id: 'plain', 
    name: 'Plain',
    description: 'A simple, plain band polished to a mirror finish',
    icon: 'plain'
  },
  { 
    id: 'pave', 
    name: 'Pavé',
    description: 'A vintage-inspired pavé setting with thin strips of metal bordering the diamonds',
    icon: 'pave'
  },
  { 
    id: 'scallop', 
    name: 'Scallop',
    description: 'A scallop setting which exposes the side of the diamonds to allow maximum sparkle',
    icon: 'scallop'
  },
]

const diamondShapes = [
  { id: 'round', name: 'Round', icon: '/images/diamonds/round.png' },
  { id: 'oval', name: 'Oval', icon: '/images/diamonds/oval.png' },
]

const ringSizes = [
  'A', 'A ½', 'B', 'B ½', 'C', 'C ½', 'D',
  'D ½', 'E', 'E ½', 'F', 'F ½', 'G', 'G ½',
  'H', 'H ½', 'I', 'I ½', 'J', 'J ½', 'K',
  'K ½', 'L', 'L ½', 'M', 'M ½', 'N', 'N ½',
  'O', 'O ½', 'P', 'P ½', 'Q', 'Q ½', 'R',
  'R ½', 'S', 'S ½', 'T', 'T ½', 'U', 'U ½',
  'V', 'V ½', 'W', 'W ½', 'X', 'X ½', 'Y',
  'Y ½', 'Z',
]

const colorGrades = [
  { grade: 'D' },
  { grade: 'E' },
  { grade: 'F' },
  { grade: 'G' },
  { grade: 'H' },
]

const clarityGrades = [
  { grade: 'IF' },
  { grade: 'VVS1' },
  { grade: 'VVS2' },
  { grade: 'VS1' },
  { grade: 'VS2' },
  { grade: 'SI1' },
  { grade: 'SI2' },
]

const cutGrades = [
  { grade: 'Excellent' },
  { grade: 'Very Good' },
]

const basePrice = 995

// Function to get images based on diamond shape
const getImagesForShape = (shape?: string): string[] => {
  if (!shape) {
    // Default images if no shape selected
    return [
      '/images/rings/portman/portman-round.avif',
      '/images/rings/portman/portman-round2.avif',
      '/images/rings/portman/portman-round3.avif',
    ]
  }

  const shapeLower = shape.toLowerCase()
  
  if (shapeLower === 'oval') {
    return [
      '/images/rings/portman/portman-oval.avif',
      '/images/rings/portman/portman-oval2.avif',
      '/images/rings/portman/portman-oval3.avif',
    ]
  } else if (shapeLower === 'round') {
    return [
      '/images/rings/portman/portman-round.avif',
      '/images/rings/portman/portman-round2.avif',
      '/images/rings/portman/portman-round3.avif',
    ]
  }

  // Default to round if shape not recognized
  return [
    '/images/rings/portman/portman-round.avif',
    '/images/rings/portman/portman-round2.avif',
    '/images/rings/portman/portman-round3.avif',
  ]
}

function PortmanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [availableDiamonds, setAvailableDiamonds] = useState<Diamond[]>([])
  const [isLoadingDiamonds, setIsLoadingDiamonds] = useState(false)
  const [diamondError, setDiamondError] = useState<string | null>(null)
  const [diamondOffset, setDiamondOffset] = useState(0)
  const [hasMoreDiamonds, setHasMoreDiamonds] = useState(false)
  const [totalDiamonds, setTotalDiamonds] = useState(0)
  
  // Diamond filter states
  const [diamondFilters, setDiamondFilters] = useState({
    colors: [] as string[],
    clarities: [] as string[],
    cuts: [] as string[],
    minCarat: 0.30,
    maxCarat: 10.00,
    minPrice: 0,
    maxPrice: 100000,
    origin: 'both' as 'natural' | 'lab-grown' | 'both',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'carat-asc' | 'carat-desc'>('price-asc')
  const [selectedDiamondDetail, setSelectedDiamondDetail] = useState<Diamond | null>(null)
  const [isRingSizeOpen, setIsRingSizeOpen] = useState(true)
  const [showCartModal, setShowCartModal] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [educationModalTopic, setEducationModalTopic] = useState<string | null>(null)
  
  // Default selections
  const defaultSelections: ProductSelections = {
    metal: '18k-yellow-gold',
    bandStyle: 'plain',
    ringSize: 'M',
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

  // Sync URL with selections
  useEffect(() => {
    const params = new URLSearchParams()
    if (selections.metal) params.set('metal', selections.metal)
    if (selections.bandStyle) params.set('bandStyle', selections.bandStyle)
    if (selections.shape) params.set('shape', selections.shape)
    if (selections.selectedDiamond) params.set('selectedDiamond', selections.selectedDiamond)
    if (selections.ringSize) params.set('ringSize', selections.ringSize)

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [selections])

  // Search diamonds when shape is selected
  useEffect(() => {
    if (selections.shape) {
      searchDiamondsFromAPI(selections.shape, selections)
    }
  }, [selections.shape])

  // Get images based on selected shape
  const images = getImagesForShape(selections.shape)

  // Reset image index when shape changes
  useEffect(() => {
    setMainImageIndex(0)
  }, [selections.shape])

  const updateSelection = (key: keyof ProductSelections, value: any) => {
    setSelections((prev) => {
      const newSelections = { ...prev, [key]: value }
      
      // If shape is selected, search for diamonds (after state update)
      if (key === 'shape' && value) {
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          searchDiamondsFromAPI(value as string, newSelections)
        }, 0)
      }
      
      return newSelections
    })
  }

  const searchDiamondsFromAPI = async (shape: string, currentSelections: ProductSelections, loadMore: boolean = false) => {
    setIsLoadingDiamonds(true)
    setDiamondError(null)
    
    // Reset diamonds if it's a new search (not load more)
    if (!loadMore) {
      setAvailableDiamonds([])
      setDiamondOffset(0)
    }
    
    try {
      const currentOffset = loadMore ? diamondOffset : 0
      const params = new URLSearchParams({
        shape: shape,
        limit: '50',
        offset: currentOffset.toString(),
        origin: diamondFilters.origin || 'both', // Use filter origin or default to both
      })
      
      const response = await fetch(`/api/nivoda/search?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to search diamonds')
      }
      
      const data = await response.json()
      // Filter diamonds with images and sort by price (lowest to highest)
      const diamondsWithImages = (data.diamonds || [])
        .filter((d: Diamond) => d.diamond?.image)
        .sort((a: Diamond, b: Diamond) => {
          const priceA = a.price || 0
          const priceB = b.price || 0
          return priceA - priceB
        })
      
      // Append new diamonds if loading more, otherwise replace
      if (loadMore) {
        setAvailableDiamonds(prev => [...prev, ...diamondsWithImages])
        setDiamondOffset(prev => prev + 50)
      } else {
        setAvailableDiamonds(diamondsWithImages)
        setDiamondOffset(50)
      }
      
      // Check if there are more diamonds to load
      // Use hasMore from API response, or check if we got the full limit
      if (data.hasMore !== undefined) {
        setHasMoreDiamonds(data.hasMore)
      } else {
        // Fallback: if we got 50 diamonds (the limit), assume there might be more
        setHasMoreDiamonds(diamondsWithImages.length === 50)
      }
      
      // Update total count if available
      if (data.total_count !== undefined) {
        setTotalDiamonds(data.total_count)
      }
    } catch (error: any) {
      console.error('Error searching diamonds:', error)
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

  const settingPrice = basePrice + (selectedMetal?.priceAdjustment || 0)
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

    const product = {
      id: `portman-${selections.selectedDiamond}-${selections.metal}-${selections.bandStyle}-${selections.ringSize}`,
      name: 'Portman Engagement Ring',
      price: totalPrice,
      image: images[0],
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

    addToCart(product)
    // Trigger cart update
    window.dispatchEvent(new Event('cartUpdated'))
    // Show modal
    setShowCartModal(true)
  }

  const mainImage = images[mainImageIndex] || images[0]

  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Product Images */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={mainImage}
                alt="Portman Engagement Ring"
                fill
                className="object-cover"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Navigation Arrows */}
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

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm z-10">
                {mainImageIndex + 1} / {images.length}
              </div>
            </div>
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
                    alt={`Portman - View ${index + 1}`}
                    fill
                    className="object-cover"
                    quality={100}
                    sizes="(max-width: 768px) 25vw, 25vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Customization */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-serif font-bold text-primary-900 mb-2">
              Portman Engagement Ring
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
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              A modern favourite, this popular solitaire engagement ring is the most elegant and refined way to show off your diamond. Unlike most solitaire rings which feature metal work that uplifts to meet the collet of the ring, the Portman is crafted with immense care and clever engineering to create a seamless joint that secures the diamond to the main band, while the metal-work takes on a super simple form. Let your diamond do all the talking. Complete with a plain band polished to a mirror finish, to intensify the sparkle of your selected diamond.
            </p>

            {/* Diamond Shape Selection */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary-900">
                  Diamond Shape: <span className="font-normal text-gold-500">
                    {selections.shape ? diamondShapes.find(s => s.id === selections.shape)?.name || selections.shape : 'Select a shape'}
                  </span>
                </h3>
                <button 
                  onClick={() => setEducationModalTopic('shape')}
                  className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  aria-label="Learn more about diamond shapes"
                >ⓘ</button>
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
                    {/* Tooltip on hover */}
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
                      // Scroll to diamond selection section
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

            {/* Metal Colour Selection */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary-900">
                  Metal Colour: <span className="font-normal text-gold-500">{selectedMetal?.name}</span>
                </h3>
                <button 
                  onClick={() => setEducationModalTopic('precious-metal')}
                  className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  aria-label="Learn more about metal colours"
                >ⓘ</button>
              </div>
              <div className="flex gap-1.5">
                {metals.map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => updateSelection('metal', metal.id)}
                    className="flex flex-col items-center gap-1 transition-all group relative"
                    title={metal.name}
                  >
                    <div
                      className={`w-8 h-8 rounded-full transition-all relative overflow-hidden ${
                        selections.metal === metal.id
                          ? 'ring-2 ring-primary-900'
                          : 'ring-1 ring-gray-200 hover:ring-gray-300'
                      }`}
                      style={{ 
                        background: metal.gradient,
                        boxShadow: selections.metal === metal.id 
                          ? '0 1px 4px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.05)' 
                          : '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
                        }}
                      />
                    </div>
                    {selections.metal === metal.id && (
                      <div className="w-6 h-0.5 bg-primary-900"></div>
                    )}
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap z-10">
                      {metal.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Band Style Selection */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary-900">
                  Band Style: <span className="font-normal text-gold-500">{selectedBandStyle?.name}</span>
                </h3>
                <button 
                  onClick={() => setEducationModalTopic('precious-metal')}
                  className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  aria-label="Learn more about band styles"
                >ⓘ</button>
              </div>
              <div className="flex gap-2">
                {bandStyles.map((band) => (
                  <button
                    key={band.id}
                    onClick={() => updateSelection('bandStyle', band.id)}
                    className={`flex flex-col items-center gap-1 p-2 border-2 rounded-lg transition-all ${
                      selections.bandStyle === band.id
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-600">{band.name}</span>
                    </div>
                    <p className="text-[10px] font-medium text-center">{band.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Ring Size Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary-900">
                  Ring Size: <span className="font-normal text-gold-500">{selections.ringSize || 'M'}</span>
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEducationModalTopic('precious-metal')}
                    className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    aria-label="Learn more about ring sizes"
                  >ⓘ</button>
                  <button 
                    onClick={() => setIsRingSizeOpen(!isRingSizeOpen)}
                    className="text-gray-400 hover:text-gray-600 text-xs transition-transform"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isRingSizeOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              {isRingSizeOpen && (
                <div className="grid grid-cols-7 gap-1">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSelection('ringSize', size)}
                      className={`py-1.5 px-2 rounded-sm border transition-all text-xs font-medium ${
                        selections.ringSize === size
                          ? 'border-primary-900 bg-primary-900 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-sm transition-colors mb-4 text-sm"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Diamond Selection Section */}
      {selections.shape ? (
        <div id="diamond-selection-section" className="container-custom py-8 border-t border-gray-200 mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
              Choose Your Diamond
            </h2>
            <p className="text-sm text-gray-600">
              Showing diamonds compatible with the Portman engagement ring
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
              >
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="carat-asc">Carat Weight (Low to High)</option>
                <option value="carat-desc">Carat Weight (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-6">
                {/* Carat Weight Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Carat Weight</h3>
                    <button className="text-gray-400 hover:text-gray-600 text-xs">ⓘ</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.50"
                      max="7.00"
                      step="0.10"
                      value={diamondFilters.minCarat}
                      onChange={(e) => setDiamondFilters({ ...diamondFilters, minCarat: parseFloat(e.target.value) || 0.50 })}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                    <span className="text-sm text-gray-600">to</span>
                    <input
                      type="number"
                      min="0.50"
                      max="7.00"
                      step="0.10"
                      value={diamondFilters.maxCarat}
                      onChange={(e) => setDiamondFilters({ ...diamondFilters, maxCarat: parseFloat(e.target.value) || 7.00 })}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                    />
                  </div>
                </div>

                {/* Colour Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Colour</h3>
                    <button className="text-gray-400 hover:text-gray-600 text-xs">ⓘ</button>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {colorGrades.map((color) => (
                      <button
                        key={color.grade}
                        onClick={() => {
                          const newColors = diamondFilters.colors.includes(color.grade)
                            ? diamondFilters.colors.filter(c => c !== color.grade)
                            : [...diamondFilters.colors, color.grade]
                          setDiamondFilters({ ...diamondFilters, colors: newColors })
                        }}
                        className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                          diamondFilters.colors.includes(color.grade)
                            ? 'bg-primary-900 text-white border-primary-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color.grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clarity Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Clarity</h3>
                    <button className="text-gray-400 hover:text-gray-600 text-xs">ⓘ</button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {clarityGrades.map((clarity) => (
                      <button
                        key={clarity.grade}
                        onClick={() => {
                          const newClarities = diamondFilters.clarities.includes(clarity.grade)
                            ? diamondFilters.clarities.filter(c => c !== clarity.grade)
                            : [...diamondFilters.clarities, clarity.grade]
                          setDiamondFilters({ ...diamondFilters, clarities: newClarities })
                        }}
                        className={`px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                          diamondFilters.clarities.includes(clarity.grade)
                            ? 'bg-primary-900 text-white border-primary-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {clarity.grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cut Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Cut</h3>
                    <button className="text-gray-400 hover:text-gray-600 text-xs">ⓘ</button>
                  </div>
                  <div className="flex gap-1.5">
                    {cutGrades.map((cut) => (
                      <button
                        key={cut.grade}
                        onClick={() => {
                          const newCuts = diamondFilters.cuts.includes(cut.grade)
                            ? diamondFilters.cuts.filter(c => c !== cut.grade)
                            : [...diamondFilters.cuts, cut.grade]
                          setDiamondFilters({ ...diamondFilters, cuts: newCuts })
                        }}
                        className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                          diamondFilters.cuts.includes(cut.grade)
                            ? 'bg-primary-900 text-white border-primary-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {cut.grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diamond Price Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Diamond Price</h3>
                    <button className="text-gray-400 hover:text-gray-600 text-xs">ⓘ</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={diamondFilters.minPrice}
                      onChange={(e) => setDiamondFilters({ ...diamondFilters, minPrice: parseInt(e.target.value) || 0 })}
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                      placeholder="min £"
                    />
                    <span className="text-sm text-gray-600">to</span>
                    <input
                      type="number"
                      min="0"
                      value={diamondFilters.maxPrice}
                      onChange={(e) => setDiamondFilters({ ...diamondFilters, maxPrice: parseInt(e.target.value) || 10000 })}
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                      placeholder="max £"
                    />
                  </div>
                </div>

                {/* Origin Filter (Natural/Lab Grown) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary-900">Type</h3>
                    <button 
                      onClick={() => setEducationModalTopic('lab-grown-diamonds')}
                      className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                      aria-label="Learn more about diamond types"
                    >ⓘ</button>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setDiamondFilters({ ...diamondFilters, origin: 'both' })
                        // Trigger new search with updated origin
                        if (selections.shape) {
                          setTimeout(() => {
                            searchDiamondsFromAPI(selections.shape!, selections)
                          }, 0)
                        }
                      }}
                      className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                        diamondFilters.origin === 'both'
                          ? 'bg-primary-900 text-white border-primary-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Both
                    </button>
                    <button
                      onClick={() => {
                        setDiamondFilters({ ...diamondFilters, origin: 'natural' })
                        // Trigger new search with updated origin
                        if (selections.shape) {
                          setTimeout(() => {
                            searchDiamondsFromAPI(selections.shape!, selections)
                          }, 0)
                        }
                      }}
                      className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                        diamondFilters.origin === 'natural'
                          ? 'bg-primary-900 text-white border-primary-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Natural
                    </button>
                    <button
                      onClick={() => {
                        setDiamondFilters({ ...diamondFilters, origin: 'lab-grown' })
                        // Trigger new search with updated origin
                        if (selections.shape) {
                          setTimeout(() => {
                            searchDiamondsFromAPI(selections.shape!, selections)
                          }, 0)
                        }
                      }}
                      className={`px-3 py-1.5 rounded border text-xs font-medium transition-all ${
                        diamondFilters.origin === 'lab-grown'
                          ? 'bg-primary-900 text-white border-primary-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Lab Grown
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Diamond Grid */}
            <div className="lg:col-span-9">
              {isLoadingDiamonds ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900 mb-4"></div>
                  <p className="text-sm text-gray-600">Searching for diamonds...</p>
                </div>
              ) : diamondError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg text-center">
                  <p className="text-sm font-medium mb-2">{diamondError}</p>
                  <p className="text-xs text-red-600">Please try adjusting your filters or selecting a different shape.</p>
                </div>
              ) : viewMode === 'list' && selectedDiamondDetail ? (
                <div className="grid lg:grid-cols-10 gap-6">
                  {/* Left - Diamond List */}
                  <div className="lg:col-span-4 space-y-4">
                    {(() => {
                // Filter and sort diamonds
                let filteredDiamonds = availableDiamonds.filter((diamond) => {
                  const carat = diamond.diamond?.certificate?.carats || 0
                  const color = diamond.diamond?.certificate?.color || ''
                  const clarity = diamond.diamond?.certificate?.clarity || ''
                  const cut = diamond.diamond?.certificate?.cut || ''
                  const price = diamond.price || 0

                  // Carat filter
                  if (carat < diamondFilters.minCarat || carat > diamondFilters.maxCarat) {
                    return false
                  }
                  
                  // Color filter - only apply if colors are selected
                  if (diamondFilters.colors.length > 0 && !diamondFilters.colors.includes(color)) {
                    return false
                  }
                  
                  // Clarity filter - only apply if clarities are selected
                  if (diamondFilters.clarities.length > 0 && !diamondFilters.clarities.includes(clarity)) {
                    return false
                  }
                  
                  // Cut filter - map API values to filter values
                  if (diamondFilters.cuts.length > 0) {
                    // Map API cut values to filter values
                    const cutMapping: Record<string, string> = {
                      'EX': 'Excellent',
                      'EXCELLENT': 'Excellent',
                      'VG': 'Very Good',
                      'VERY GOOD': 'Very Good',
                      'VERY_GOOD': 'Very Good',
                    }
                    const mappedCut = cutMapping[cut] || cut
                    if (!diamondFilters.cuts.includes(mappedCut)) {
                      return false
                    }
                  }
                  
                  // Price filter
                  if (price < diamondFilters.minPrice || price > diamondFilters.maxPrice) {
                    return false
                  }
                  
                  return true
                })
                
                console.log('Available diamonds:', availableDiamonds.length)
                console.log('Filtered diamonds:', filteredDiamonds.length)
                console.log('Sample diamond:', availableDiamonds[0])
                console.log('Filters:', diamondFilters)

                // Sort diamonds
                filteredDiamonds = [...filteredDiamonds].sort((a, b) => {
                  if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
                  if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
                  if (sortBy === 'carat-asc') return (a.diamond?.certificate?.carats || 0) - (b.diamond?.certificate?.carats || 0)
                  if (sortBy === 'carat-desc') return (b.diamond?.certificate?.carats || 0) - (a.diamond?.certificate?.carats || 0)
                  return 0
                })

                if (filteredDiamonds.length === 0) {
                  return (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">No diamonds found matching your filters.</p>
                      <p className="text-xs text-gray-500">Try adjusting your search criteria or clearing some filters.</p>
                    </div>
                  )
                }

                return filteredDiamonds.map((diamond) => (
                  <button
                    key={diamond.id}
                    onClick={() => {
                      updateSelection('selectedDiamond', diamond.id)
                      setSelectedDiamondDetail(diamond)
                      setSelectedMediaIndex(0) // Reset to show video first if available
                    }}
                    className={`bg-white border-2 rounded-lg overflow-hidden transition-all text-left w-full flex gap-4 p-4 ${
                      selections.selectedDiamond === diamond.id
                        ? 'border-gold-500 ring-2 ring-gold-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {diamond.diamond?.image && (
                      <div className="w-32 h-32 flex-shrink-0 bg-gray-100 relative overflow-hidden rounded">
                        <Image
                          src={diamond.diamond.image.replace('500/500', '300/300')}
                          alt="Diamond"
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-3">
                      {diamond.price && (
                        <p className="text-lg font-bold text-primary-900 mb-1">
                          £{diamond.price.toLocaleString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 mb-1">
                        {diamond.diamond?.certificate?.carats?.toFixed(2)}ct {diamond.diamond?.certificate?.shape || selections.shape}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {[
                          diamond.diamond?.certificate?.color,
                          diamond.diamond?.certificate?.clarity,
                          diamond.diamond?.certificate?.cut
                        ].filter(Boolean).join(', ')}
                      </p>
                      {diamond.diamond?.certificate?.lab && (
                        <div className="flex items-center justify-end">
                          <span className="text-[10px] text-gray-500 uppercase">
                            {diamond.diamond.certificate.lab}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))
                    })()}
                  
                  {/* Load More Button */}
                  {hasMoreDiamonds && !isLoadingDiamonds && (
                    <div className="col-span-full flex justify-center mt-6">
                      <button
                        onClick={loadMoreDiamonds}
                        className="bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded transition-colors"
                      >
                        Load More Diamonds
                      </button>
                    </div>
                  )}
                  
                  {isLoadingDiamonds && (
                    <div className="col-span-full flex justify-center mt-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="h-6 w-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Loading more diamonds...</span>
                      </div>
                    </div>
                  )}
                  </div>
                  {/* Right - Diamond Details */}
                  <div className="lg:col-span-6 bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                          {selectedDiamondDetail.diamond?.certificate?.carats?.toFixed(2)}ct {selectedDiamondDetail.diamond?.certificate?.shape || selections.shape}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {selectedDiamondDetail.diamond?.certificate?.lab ? `${selectedDiamondDetail.diamond.certificate.lab} Certified` : 'Diamond'}, {selectedDiamondDetail.diamond?.certificate?.color || 'N/A'} Colour, {selectedDiamondDetail.diamond?.certificate?.clarity || 'N/A'} Clarity, {selectedDiamondDetail.diamond?.certificate?.cut || 'N/A'} Cut
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedDiamondDetail(null)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label="Close details"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Left - Diamond Media Gallery */}
                      <div>
                        {/* Main Media Display */}
                        <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                          {selectedMediaIndex === 0 && selectedDiamondDetail.diamond?.video ? (
                            <iframe
                              src={selectedDiamondDetail.diamond.video}
                              className="w-full h-full"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                              title="Diamond Video"
                            />
                          ) : selectedDiamondDetail.diamond?.image ? (
                            <Image
                              src={selectedDiamondDetail.diamond.image.replace('500/500', '600/600')}
                              alt="Diamond"
                              width={600}
                              height={600}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2">
                          {/* Video thumbnail (if available) */}
                          {selectedDiamondDetail.diamond?.video && (
                            <button
                              onClick={() => setSelectedMediaIndex(0)}
                              className={`aspect-square bg-gray-100 rounded overflow-hidden relative border-2 ${
                                selectedMediaIndex === 0 ? 'border-primary-900' : 'border-transparent'
                              }`}
                            >
                              <div className="w-full h-full bg-black flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </button>
                          )}
                          
                          {/* Image thumbnail */}
                          {selectedDiamondDetail.diamond?.image && (
                            <button
                              onClick={() => setSelectedMediaIndex(selectedDiamondDetail.diamond?.video ? 1 : 0)}
                              className={`aspect-square bg-gray-100 rounded overflow-hidden relative border-2 ${
                                (selectedDiamondDetail.diamond?.video && selectedMediaIndex === 1) || 
                                (!selectedDiamondDetail.diamond?.video && selectedMediaIndex === 0)
                                  ? 'border-primary-900' 
                                  : 'border-transparent'
                              }`}
                            >
                              <Image
                                src={selectedDiamondDetail.diamond.image.replace('500/500', '200/200')}
                                alt="Diamond image"
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right - Specifications */}
                      <div>
                        {/* Price and Certification */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          {selectedDiamondDetail.price && (
                            <p className="text-3xl font-bold text-primary-900 mb-2">
                              £{selectedDiamondDetail.price.toLocaleString()}
                            </p>
                          )}
                          {selectedDiamondDetail.diamond?.certificate?.lab && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-700 uppercase">
                                {selectedDiamondDetail.diamond.certificate.lab}
                              </span>
                              {selectedDiamondDetail.diamond.certificate.certNumber && (
                                <span className="text-xs text-gray-500">
                                  Cert: {selectedDiamondDetail.diamond.certificate.certNumber}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Specifications */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 text-sm">ⓘ</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-600">Type: </span>
                              <span className="text-sm font-medium text-primary-900">Natural Diamond</span>
                            </div>
                          </div>
                          {selectedDiamondDetail.diamond?.certificate?.shape && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400 text-sm">ⓘ</span>
                              <div className="flex-1">
                                <span className="text-sm text-gray-600">Shape: </span>
                                <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.shape}</span>
                              </div>
                            </div>
                          )}
                          {selectedDiamondDetail.diamond?.certificate?.carats && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400 text-sm">ⓘ</span>
                              <div className="flex-1">
                                <span className="text-sm text-gray-600">Carat Weight: </span>
                                <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.carats.toFixed(2)} ct</span>
                              </div>
                            </div>
                          )}
                          {selectedDiamondDetail.diamond?.certificate?.cut && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400 text-sm">ⓘ</span>
                              <div className="flex-1">
                                <span className="text-sm text-gray-600">Cut: </span>
                                <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.cut}</span>
                              </div>
                            </div>
                          )}
                          {selectedDiamondDetail.diamond?.certificate?.color && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400 text-sm">ⓘ</span>
                              <div className="flex-1">
                                <span className="text-sm text-gray-600">Colour: </span>
                                <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.color}</span>
                              </div>
                            </div>
                          )}
                          {selectedDiamondDetail.diamond?.certificate?.clarity && (
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400 text-sm">ⓘ</span>
                              <div className="flex-1">
                                <span className="text-sm text-gray-600">Clarity: </span>
                                <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.clarity}</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 text-sm">ⓘ</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-600">Fluorescence: </span>
                              <span className="text-sm font-medium text-primary-900">None</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 text-sm">ⓘ</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-600">Availability: </span>
                              <span className="text-sm font-medium text-primary-900">Online Only</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 text-sm">ⓘ</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-600">Polish: </span>
                              <span className="text-sm font-medium text-primary-900">Excellent</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 text-sm">ⓘ</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-600">Symmetry: </span>
                              <span className="text-sm font-medium text-primary-900">Excellent</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              updateSelection('selectedDiamond', selectedDiamondDetail.id)
                              showSuccess('Diamond selected!')
                            }}
                            className="flex-1 bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded transition-colors"
                          >
                            SELECT DIAMOND
                          </button>
                          <button
                            onClick={() => {
                              // Determine which education topic to show based on diamond properties
                              if (selectedDiamondDetail.diamond?.certificate?.lab) {
                                setEducationModalTopic('certificates')
                              } else if (selectedDiamondDetail.diamond?.certificate?.cut) {
                                setEducationModalTopic('cut')
                              } else if (selectedDiamondDetail.diamond?.certificate?.clarity) {
                                setEducationModalTopic('clarity')
                              } else if (selectedDiamondDetail.diamond?.certificate?.color) {
                                setEducationModalTopic('colour')
                              } else if (selectedDiamondDetail.diamond?.certificate?.shape) {
                                setEducationModalTopic('shape')
                              } else {
                                setEducationModalTopic('shape') // Default to shape
                              }
                            }}
                            className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded transition-colors"
                          >
                            VIEW DETAILS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (() => {
                // Filter and sort diamonds
                let filteredDiamonds = availableDiamonds.filter((diamond) => {
                  const carat = diamond.diamond?.certificate?.carats || 0
                  const color = diamond.diamond?.certificate?.color || ''
                  const clarity = diamond.diamond?.certificate?.clarity || ''
                  const cut = diamond.diamond?.certificate?.cut || ''
                  const price = diamond.price || 0

                  // Carat filter
                  if (carat < diamondFilters.minCarat || carat > diamondFilters.maxCarat) {
                    return false
                  }
                  
                  // Color filter - only apply if colors are selected
                  if (diamondFilters.colors.length > 0 && !diamondFilters.colors.includes(color)) {
                    return false
                  }
                  
                  // Clarity filter - only apply if clarities are selected
                  if (diamondFilters.clarities.length > 0 && !diamondFilters.clarities.includes(clarity)) {
                    return false
                  }
                  
                  // Cut filter - map API values to filter values
                  if (diamondFilters.cuts.length > 0) {
                    const cutMapping: Record<string, string> = {
                      'EX': 'Excellent',
                      'EXCELLENT': 'Excellent',
                      'VG': 'Very Good',
                      'VERY GOOD': 'Very Good',
                      'VERY_GOOD': 'Very Good',
                    }
                    const mappedCut = cutMapping[cut] || cut
                    if (!diamondFilters.cuts.includes(mappedCut)) {
                      return false
                    }
                  }
                  
                  // Price filter
                  if (price < diamondFilters.minPrice || price > diamondFilters.maxPrice) {
                    return false
                  }
                  
                  return true
                })

                // Sort diamonds
                filteredDiamonds = [...filteredDiamonds].sort((a, b) => {
                  if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
                  if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
                  if (sortBy === 'carat-asc') return (a.diamond?.certificate?.carats || 0) - (b.diamond?.certificate?.carats || 0)
                  if (sortBy === 'carat-desc') return (b.diamond?.certificate?.carats || 0) - (a.diamond?.certificate?.carats || 0)
                  return 0
                })

                if (filteredDiamonds.length === 0) {
                  return (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">No diamonds found matching your filters.</p>
                      <p className="text-xs text-gray-500">Try adjusting your search criteria or clearing some filters.</p>
                    </div>
                  )
                }

                return (
                  <>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
                      {filteredDiamonds.map((diamond) => (
                        <button
                          key={diamond.id}
                          onClick={() => {
                            updateSelection('selectedDiamond', diamond.id)
                            setSelectedDiamondDetail(diamond)
                      setSelectedMediaIndex(0) // Reset to show video first if available
                          }}
                          className={`bg-white border-2 rounded-lg overflow-hidden transition-all text-left ${
                            selections.selectedDiamond === diamond.id
                              ? 'border-gold-500 ring-2 ring-gold-200'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${viewMode === 'list' ? 'flex gap-4 p-4' : ''}`}
                        >
                          {diamond.diamond?.image && (
                            <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full aspect-square'} bg-gray-100 relative overflow-hidden`}>
                              <Image
                                src={diamond.diamond.image.replace('500/500', '300/300')}
                                alt="Diamond"
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            {diamond.price && (
                              <p className="text-lg font-bold text-primary-900 mb-1">
                                £{diamond.price.toLocaleString()}
                              </p>
                            )}
                            <p className="text-sm text-gray-700 mb-1">
                              {diamond.diamond?.certificate?.carats?.toFixed(2)}ct {diamond.diamond?.certificate?.shape || selections.shape}
                            </p>
                            <p className="text-xs text-gray-600 mb-2">
                              {[
                                diamond.diamond?.certificate?.color,
                                diamond.diamond?.certificate?.clarity,
                                diamond.diamond?.certificate?.cut
                              ].filter(Boolean).join(', ')}
                            </p>
                            {diamond.diamond?.certificate?.lab && (
                              <div className="flex items-center justify-end">
                                <span className="text-[10px] text-gray-500 uppercase">
                                  {diamond.diamond.certificate.lab}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {hasMoreDiamonds && !isLoadingDiamonds && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={loadMoreDiamonds}
                          className="bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded transition-colors"
                        >
                          Load More Diamonds
                        </button>
                      </div>
                    )}
                    
                    {isLoadingDiamonds && (
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="h-6 w-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Loading more diamonds...</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Diamond Detail Section - Below the grid */}
                    {selectedDiamondDetail && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                                {selectedDiamondDetail.diamond?.certificate?.carats?.toFixed(2)}ct {selectedDiamondDetail.diamond?.certificate?.shape || selections.shape}
                              </h2>
                              <p className="text-sm text-gray-600">
                                {selectedDiamondDetail.diamond?.certificate?.lab ? `${selectedDiamondDetail.diamond.certificate.lab} Certified` : 'Diamond'}, {selectedDiamondDetail.diamond?.certificate?.color || 'N/A'} Colour, {selectedDiamondDetail.diamond?.certificate?.clarity || 'N/A'} Clarity, {selectedDiamondDetail.diamond?.certificate?.cut || 'N/A'} Cut
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedDiamondDetail(null)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                              aria-label="Close details"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid lg:grid-cols-2 gap-8">
                            {/* Left - Diamond Media Gallery */}
                            <div>
                              {/* Main Media Display */}
                              <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                                {selectedMediaIndex === 0 && selectedDiamondDetail.diamond?.video ? (
                                  <iframe
                                    src={selectedDiamondDetail.diamond.video}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen"
                                    allowFullScreen
                                    title="Diamond Video"
                                  />
                                ) : selectedDiamondDetail.diamond?.image ? (
                                  <Image
                                    src={selectedDiamondDetail.diamond.image.replace('500/500', '600/600')}
                                    alt="Diamond"
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                              
                              {/* Thumbnails */}
                              <div className="grid grid-cols-4 gap-2">
                                {/* Video thumbnail (if available) */}
                                {selectedDiamondDetail.diamond?.video && (
                                  <button
                                    onClick={() => setSelectedMediaIndex(0)}
                                    className={`aspect-square bg-gray-100 rounded overflow-hidden relative border-2 ${
                                      selectedMediaIndex === 0 ? 'border-primary-900' : 'border-transparent'
                                    }`}
                                  >
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                      </svg>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                      </svg>
                                    </div>
                                  </button>
                                )}
                                
                                {/* Image thumbnail */}
                                {selectedDiamondDetail.diamond?.image && (
                                  <button
                                    onClick={() => setSelectedMediaIndex(selectedDiamondDetail.diamond?.video ? 1 : 0)}
                                    className={`aspect-square bg-gray-100 rounded overflow-hidden relative border-2 ${
                                      (selectedDiamondDetail.diamond?.video && selectedMediaIndex === 1) || 
                                      (!selectedDiamondDetail.diamond?.video && selectedMediaIndex === 0)
                                        ? 'border-primary-900' 
                                        : 'border-transparent'
                                    }`}
                                  >
                                    <Image
                                      src={selectedDiamondDetail.diamond.image.replace('500/500', '200/200')}
                                      alt="Diamond image"
                                      width={200}
                                      height={200}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Right - Specifications */}
                            <div>
                              {/* Price and Certification */}
                              <div className="mb-6 pb-6 border-b border-gray-200">
                                {selectedDiamondDetail.price && (
                                  <p className="text-3xl font-bold text-primary-900 mb-2">
                                    £{selectedDiamondDetail.price.toLocaleString()}
                                  </p>
                                )}
                                {selectedDiamondDetail.diamond?.certificate?.lab && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700 uppercase">
                                      {selectedDiamondDetail.diamond.certificate.lab}
                                    </span>
                                    {selectedDiamondDetail.diamond.certificate.certNumber && (
                                      <span className="text-xs text-gray-500">
                                        Cert: {selectedDiamondDetail.diamond.certificate.certNumber}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Specifications */}
                              <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 text-sm">ⓘ</span>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-600">Type: </span>
                                    <span className="text-sm font-medium text-primary-900">Natural Diamond</span>
                                  </div>
                                </div>
                                {selectedDiamondDetail.diamond?.certificate?.shape && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-400 text-sm">ⓘ</span>
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-600">Shape: </span>
                                      <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.shape}</span>
                                    </div>
                                  </div>
                                )}
                                {selectedDiamondDetail.diamond?.certificate?.carats && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-400 text-sm">ⓘ</span>
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-600">Carat Weight: </span>
                                      <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.carats.toFixed(2)} ct</span>
                                    </div>
                                  </div>
                                )}
                                {selectedDiamondDetail.diamond?.certificate?.cut && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-400 text-sm">ⓘ</span>
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-600">Cut: </span>
                                      <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.cut}</span>
                                    </div>
                                  </div>
                                )}
                                {selectedDiamondDetail.diamond?.certificate?.color && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-400 text-sm">ⓘ</span>
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-600">Colour: </span>
                                      <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.color}</span>
                                    </div>
                                  </div>
                                )}
                                {selectedDiamondDetail.diamond?.certificate?.clarity && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-gray-400 text-sm">ⓘ</span>
                                    <div className="flex-1">
                                      <span className="text-sm text-gray-600">Clarity: </span>
                                      <span className="text-sm font-medium text-primary-900">{selectedDiamondDetail.diamond.certificate.clarity}</span>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 text-sm">ⓘ</span>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-600">Fluorescence: </span>
                                    <span className="text-sm font-medium text-primary-900">None</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 text-sm">ⓘ</span>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-600">Availability: </span>
                                    <span className="text-sm font-medium text-primary-900">Online Only</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 text-sm">ⓘ</span>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-600">Polish: </span>
                                    <span className="text-sm font-medium text-primary-900">Excellent</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 text-sm">ⓘ</span>
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-600">Symmetry: </span>
                                    <span className="text-sm font-medium text-primary-900">Excellent</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    updateSelection('selectedDiamond', selectedDiamondDetail.id)
                                    showSuccess('Diamond selected!')
                                  }}
                                  className="flex-1 bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded transition-colors"
                                >
                                  SELECT DIAMOND
                                </button>
                                <button
                                  onClick={() => {
                                    // Determine which education topic to show based on diamond properties
                                    if (selectedDiamondDetail.diamond?.certificate?.lab) {
                                      setEducationModalTopic('certificates')
                                    } else if (selectedDiamondDetail.diamond?.certificate?.cut) {
                                      setEducationModalTopic('cut')
                                    } else if (selectedDiamondDetail.diamond?.certificate?.clarity) {
                                      setEducationModalTopic('clarity')
                                    } else if (selectedDiamondDetail.diamond?.certificate?.color) {
                                      setEducationModalTopic('colour')
                                    } else if (selectedDiamondDetail.diamond?.certificate?.shape) {
                                      setEducationModalTopic('shape')
                                    } else {
                                      setEducationModalTopic('shape') // Default to shape
                                    }
                                  }}
                                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded transition-colors"
                                >
                                  VIEW DETAILS
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                    </>
                  )
                })()}
            </div>
          </div>
        </div>
      ) : null}

      {/* Cart Modal */}
      {showCartModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowCartModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">
                  Item Added to Cart!
                </h3>
                <p className="text-gray-600">
                  Your item has been successfully added to your shopping cart.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded transition-colors"
                >
                  Go to Checkout
                </button>
                <button
                  onClick={() => setShowCartModal(false)}
                  className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Education Modal */}
      {educationModalTopic && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setEducationModalTopic(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-serif font-bold text-primary-900">
                  {educationModalTopic === 'shape' && 'Diamond Shapes'}
                  {educationModalTopic === 'carat' && 'Carat'}
                  {educationModalTopic === 'colour' && 'Colour'}
                  {educationModalTopic === 'clarity' && 'Diamond Clarity'}
                  {educationModalTopic === 'cut' && 'Diamond Cut'}
                  {educationModalTopic === 'certificates' && 'Certificates'}
                  {educationModalTopic === 'lab-grown-diamonds' && 'Lab Grown Diamonds'}
                  {educationModalTopic === 'precious-metal' && 'Precious Metals'}
                </h2>
                <button
                  onClick={() => setEducationModalTopic(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="prose prose-lg max-w-none">
                  {educationModalTopic === 'shape' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        Choosing the right diamond shape for your partner can feel like a hard decision, but usually your gut instincts will lead you to the perfect shape.
                      </p>
                      <p>
                        Each diamond shape has its own unique characteristics and appeal. The shape you choose should reflect your partner's personal style and preferences.
                      </p>
                    </div>
                  )}
                  
                  {educationModalTopic === 'carat' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        Understanding carat weight and its impact on diamond size and value.
                      </p>
                      <p>
                        Carat refers to the weight of a diamond. Diamonds are all weighed in metric carats rather than grams or ounces. This is a standard industry practice around the world.
                      </p>
                      <p>
                        Diamond is expressed to the hundredth of a carat. Carat weight of less than a carat is expressed in points. So, for example, a 0.75ct diamond will be 75 points.
                      </p>
                      <p>
                        A common misconception is that it refers to the physical size of a diamond, which is incorrect. The diamond weight does not govern the size of stone.
                      </p>
                    </div>
                  )}
                  
                  {educationModalTopic === 'colour' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        When searching for your perfect diamond, one of the C's to consider during this process is the Colour. Usually, people tend to choose a diamond with the least amount of colour, as it shows the purity of colour and rarity of quality.
                      </p>
                      <p>
                        The diamond colour grading system is based on an alphabetised system, starting from 'D', meaning the diamond is completely free of any colour, all the way to 'Z', meaning there is a visible tint of colour in the diamond.
                      </p>
                      <p>
                        To see a difference in colour between two diamonds, you usually have to compare at least three colour grades (i.e, E Colour and a H Colour).
                      </p>
                    </div>
                  )}
                  
                  {educationModalTopic === 'clarity' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        Diamond clarity is the grading of the amount and size of imperfections in a diamond, commonly known as inclusions.
                      </p>
                      <p>
                        When diamonds are formed imperfections inside the diamond form and impurities become trapped inside the stone called carbon. Almost all diamonds contain small traces of carbon. Most inclusions are not visible to the naked eye and require at least a 10x magnification to identify the imperfections.
                      </p>
                    </div>
                  )}
                  
                  {educationModalTopic === 'cut' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        Not to be mistaken with shape, your diamond cut is an important characteristic to consider when purchasing a diamond. The cut will ultimately govern how well the light is refracted; giving the diamond it's sparkle.
                      </p>
                      <p>
                        If you purchase a badly cut diamond then it will not refract the light as well and will not sparkle. Poorly cut diamonds will also give you a smaller spread for your selected carat weight.
                      </p>
                      <p>
                        Cut grades were developed by the GIA (Gemological Institute of America) during the 1940's and 1950's to enable independent labs to not only evaluate clarity and colour, but to check the structure of the diamond itself.
                      </p>
                      <p>
                        It is important to ensure you select a well-cut diamond so that you get a good sparkle. You may be able to save a lot of money on poorer cut diamonds, but ultimately you will pay with a diamond that does not sparkle and lacks lustre.
                      </p>
                    </div>
                  )}
                  
                  {educationModalTopic === 'certificates' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        At Jabour, we understand our customers require peace of mind when buying a beautiful piece of jewellery. We want customers to be confident that all diamonds sold by Jabour are the quality advertised. Therefore, all our jewellery comes with diamond certification as standard.
                      </p>
                      <div className="space-y-4">
                        <h3 className="text-xl font-serif font-normal text-primary-900">
                          What is a Diamond Certificate?
                        </h3>
                        <p>
                          A Diamond certificate is a report created by a team of gemologist to evaluate the quality of a diamond. They are also known as a Diamond Grading Report, a Diamond Dossier, and a Diamond Quality document. It is an impartial documentation from a highly trained team of gemologists, giving an impartial assessment on each diamond. During the grading process, the 4 C's (colour, clarity, carat, cut) are strictly assessed using jeweller's loupes, microscopes, and other industry standard tools.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-serif font-normal text-primary-900">
                          Why is Diamond Certificate important?
                        </h3>
                        <p>
                          A diamond certification is your proof of purchase for your chosen gem. Like a snowflake, no two diamonds are the same, so this should be recognised by the diamond grading laboratories. A diamond certificate is also required to ensure your jewellery is insured for the correct value with your home insurance. If a diamond is purchased without certification, it will not only be hard to insure the item but there will also be no way of proving the quality of the diamond. A diamond certificate is your peace of mind during the final stages of the purchasing process.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {educationModalTopic === 'lab-grown-diamonds' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        Lab Grown diamonds, also known as man-made diamonds, are identical to Natural diamonds in its chemical properties. The only difference is how the diamonds are created. Whilst Natural diamonds take millions of years to develop beneath the Earth's crust, Lab Grown Diamonds are created in highly controlled laboratory environments that imitate the conditions a natural diamond is created in a fraction of the time.
                      </p>
                      <p>
                        There are barely any visible differences when comparing a Lab Grown Diamond to a natural Diamond. Lab Grown Diamonds have the same light performance as a natural diamond, the same durability, the same hardness and most importantly, can be certified by established diamond grading labs such as GIA and IGI.
                      </p>
                    </div>
                  )}
                  
                  {educationModalTopic === 'precious-metal' && (
                    <div className="space-y-6 text-gray-700 leading-relaxed font-light">
                      <p className="text-lg">
                        The metal you choose should suit not only your partner's style but also showcase the diamond. Yellow Gold is a traditional choice and warming to most skin tones.
                      </p>
                      <p>
                        Each metal has its own unique properties, durability, and appearance. Consider factors such as lifestyle, skin tone, and personal preference when choosing the metal for your engagement ring.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href={`/education/${educationModalTopic}`}
                    className="text-primary-900 hover:text-gold-500 font-semibold underline"
                  >
                    Learn more about {educationModalTopic === 'shape' && 'Diamond Shapes'}
                    {educationModalTopic === 'carat' && 'Carat'}
                    {educationModalTopic === 'colour' && 'Colour'}
                    {educationModalTopic === 'clarity' && 'Diamond Clarity'}
                    {educationModalTopic === 'cut' && 'Diamond Cut'}
                    {educationModalTopic === 'certificates' && 'Certificates'}
                    {educationModalTopic === 'lab-grown-diamonds' && 'Lab Grown Diamonds'}
                    {educationModalTopic === 'precious-metal' && 'Precious Metals'} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function PortmanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading product configuration...</p>
      </div>
    }>
      <PortmanContent />
    </Suspense>
  )
}

