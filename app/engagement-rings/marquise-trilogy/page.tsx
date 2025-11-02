'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { addToCart } from '@/lib/cart'
import { showSuccess } from '@/components/Toast'

interface ProductSelections {
  metal: string
  carat: number
  color: string
  clarity: string
  cut: string
  certificate: string
}

const metals = [
  { id: '9k-white-gold', name: '9k White Gold', color: '#f9fafb', priceAdjustment: 0 },
  { id: '9k-yellow-gold', name: '9k Yellow Gold', color: '#fbbf24', priceAdjustment: 0 },
  { id: '9k-rose-gold', name: '9k Rose Gold', color: '#f472b6', priceAdjustment: 0 },
  { id: '18k-white-gold', name: '18k White Gold', color: '#ffffff', priceAdjustment: 100 },
  { id: '18k-yellow-gold', name: '18k Yellow Gold', color: '#fbbf24', priceAdjustment: 150 },
  { id: '18k-rose-gold', name: '18k Rose Gold', color: '#f472b6', priceAdjustment: 150 },
  { id: 'platinum', name: 'Platinum', color: '#d1d5db', priceAdjustment: 200 },
]

const caratOptions = [
  { value: 0.30, label: '0.30ct' },
  { value: 0.40, label: '0.40ct' },
  { value: 0.50, label: '0.50ct' },
  { value: 0.60, label: '0.60ct' },
  { value: 0.70, label: '0.70ct' },
  { value: 0.80, label: '0.80ct' },
  { value: 0.90, label: '0.90ct' },
  { value: 1.00, label: '1.00ct' },
  { value: 1.20, label: '1.20ct' },
  { value: 1.50, label: '1.50ct' },
  { value: 2.00, label: '2.00ct' },
  { value: 2.50, label: '2.50ct' },
  { value: 3.00, label: '3.00ct' },
  { value: 4.00, label: '4.00ct' },
]

const colorGrades = [
  { grade: 'D', description: 'Colourless - The highest grade, completely colourless', priceAdjustment: 450 },
  { grade: 'E', description: 'Colourless - Virtually colourless, only detectable by experts', priceAdjustment: 380 },
  { grade: 'F', description: 'Colourless - Tiny amount of colour, only visible to experts', priceAdjustment: 300 },
  { grade: 'G', description: 'Near colourless - Near colourless but with a hint of colour which is more noticeable when compared to higher grades', priceAdjustment: 200 },
  { grade: 'H', description: 'Near colourless - Slight trace of colour visible to naked eye', priceAdjustment: 150 },
  { grade: 'I', description: 'Near colourless - Noticeable colour when viewed face down', priceAdjustment: 100 },
  { grade: 'J', description: 'Near colourless - Visible colour, especially when compared to higher grades', priceAdjustment: 50 },
  { grade: 'K', description: 'Faint yellow - Noticeable yellow tint', priceAdjustment: 0 },
]

const clarityGrades = [
  { grade: 'SI2', description: 'Slightly Included - Inclusions can be visible from all sides of the diamond with the naked eye', priceAdjustment: 0, inclusions: 'many' },
  { grade: 'SI1', description: 'Slightly Included - Inclusions visible with 10x magnification, may be visible to naked eye', priceAdjustment: 27, inclusions: 'some' },
  { grade: 'VS2', description: 'Very Slightly Included - Minor inclusions difficult to see under 10x magnification', priceAdjustment: 44, inclusions: 'few' },
  { grade: 'VS1', description: 'Very Slightly Included - Minor inclusions very difficult to see under 10x magnification', priceAdjustment: 53, inclusions: 'few' },
  { grade: 'VVS2', description: 'Very Very Slightly Included - Extremely difficult to see inclusions under 10x magnification', priceAdjustment: 113, inclusions: 'very-few' },
  { grade: 'VVS1', description: 'Very Very Slightly Included - Very difficult to see inclusions under 10x magnification', priceAdjustment: 64, inclusions: 'very-few' },
  { grade: 'IF', description: 'Internally Flawless - No internal inclusions visible under 10x magnification', priceAdjustment: 80, inclusions: 'none' },
]

const cutGrades = [
  { grade: 'Good', description: 'Good - Reflects the light and a great price to prioritise the carat weight', priceAdjustment: 0 },
  { grade: 'Very Good', description: 'Very Good - Excellent light reflection with superior sparkle', priceAdjustment: 9 },
  { grade: 'Excellent', description: 'Excellent - Maximum light reflection, fire, and brilliance', priceAdjustment: 27 },
]

const certificates = [
  { id: 'jabour', name: 'Jabour Certificate', priceAdjustment: 0 },
  { id: 'idgl', name: 'IDGL', priceAdjustment: 25 },
  { id: 'igi', name: 'IGI', priceAdjustment: 50 },
]

const basePrice = 1200

const images = [
  'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise_1.jpg',
  'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise-2.jpg',
  'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise-3.jpg',
  'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise-4.jpg',
]

function MarquiseTrilogyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Default selections
  const defaultSelections: ProductSelections = {
    metal: 'platinum',
    carat: 0.50,
    color: 'G',
    clarity: 'SI2',
    cut: 'Good',
    certificate: 'jabour',
  }

  // Initialize selections from URL params or defaults
  const getInitialSelections = (): ProductSelections => {
    const metal = searchParams?.get('metal') || defaultSelections.metal
    const caratParam = searchParams?.get('carat')
    let carat = defaultSelections.carat
    if (caratParam) {
      const parsed = parseFloat(caratParam)
      if (!isNaN(parsed) && parsed >= 0.30 && parsed <= 4.00) {
        carat = parsed
      }
    }
    const color = searchParams?.get('color') || defaultSelections.color
    const clarity = searchParams?.get('clarity') || defaultSelections.clarity
    const cut = searchParams?.get('cut') || defaultSelections.cut
    const certificate = searchParams?.get('certificate') || defaultSelections.certificate

    // Ensure carat is a valid number with exactly 2 decimal places
    const roundedCarat = Math.round(carat * 100) / 100

    return {
      metal,
      carat: roundedCarat,
      color,
      clarity,
      cut,
      certificate,
    }
  }

  const [selections, setSelections] = useState<ProductSelections>(defaultSelections)
  const [isInitialMount, setIsInitialMount] = useState(true)

  // Initialize selections from URL on mount
  useEffect(() => {
    const urlSelections = getInitialSelections()
    setSelections(urlSelections)
    setIsInitialMount(false)
  }, [])

  // Update selections when URL changes (back/forward navigation)
  useEffect(() => {
    if (!isInitialMount) {
      const urlSelections = getInitialSelections()
      setSelections(urlSelections)
    }
  }, [searchParams])

  // Update URL when selections change (but not on initial mount)
  const updateURL = (newSelections: ProductSelections, skipInitial = false) => {
    if (isInitialMount && skipInitial) return
    
    const params = new URLSearchParams()
    if (newSelections.metal !== defaultSelections.metal) params.set('metal', newSelections.metal)
    if (newSelections.carat !== defaultSelections.carat) params.set('carat', newSelections.carat.toFixed(2))
    if (newSelections.color !== defaultSelections.color) params.set('color', newSelections.color)
    if (newSelections.clarity !== defaultSelections.clarity) params.set('clarity', newSelections.clarity)
    if (newSelections.cut !== defaultSelections.cut) params.set('cut', newSelections.cut)
    if (newSelections.certificate !== defaultSelections.certificate) params.set('certificate', newSelections.certificate)

    const newURL = params.toString() 
      ? `/engagement-rings/marquise-trilogy?${params.toString()}`
      : '/engagement-rings/marquise-trilogy'
    
    router.replace(newURL, { scroll: false })
  }


  const mainImage = images[mainImageIndex]

  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const updateSelection = (key: keyof ProductSelections, value: string | number) => {
    setSelections((prev) => {
      let newSelections: ProductSelections
      
      if (key === 'carat') {
        const caratValue = typeof value === 'number' ? value : parseFloat(String(value))
        const roundedValue = Math.round(caratValue * 100) / 100
        newSelections = { ...prev, [key]: roundedValue }
      } else {
        newSelections = { ...prev, [key]: value } as ProductSelections
      }
      
      // Update URL when selection changes (only after initial mount)
      if (!isInitialMount) {
        updateURL(newSelections)
      }
      
      return newSelections
    })
  }

  // Calculate price
  const selectedMetal = metals.find((m) => m.id === selections.metal)
  const selectedColor = colorGrades.find((c) => c.grade === selections.color)
  const selectedClarity = clarityGrades.find((c) => c.grade === selections.clarity)
  const selectedCut = cutGrades.find((c) => c.grade === selections.cut)
  const selectedCertificate = certificates.find((c) => c.id === selections.certificate)

  // Base price varies with carat
  const caratMultiplier = selections.carat / 1.0
  const caratPriceAdjustment = (selections.carat - 1.0) * 500

  const totalPrice = Math.round(
    basePrice * caratMultiplier +
    caratPriceAdjustment +
    (selectedMetal?.priceAdjustment || 0) +
    (selectedColor?.priceAdjustment || 0) +
    (selectedClarity?.priceAdjustment || 0) +
    (selectedCut?.priceAdjustment || 0) +
    (selectedCertificate?.priceAdjustment || 0)
  )

  const handleAddToCart = () => {
    const product = {
      id: `marquise-solitaire-${Date.now()}`,
      name: 'Marquise Solitaire Engagement Ring',
      price: totalPrice,
      category: 'engagement-rings',
      style: 'solitaire',
      description: `This 2 Prong, 3 Prong Solitaire features a Marquise, Pear centre stone weighing ${selections.carat.toFixed(2)} ct.wt.. The diamond's ${selectedColor?.grade} colour and ${selections.clarity} clarity provide brilliance and fire. Crafted in ${selectedMetal?.name}, this solitaire ring represents timeless elegance.`,
      customizations: selections,
      image: 'https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/marquise/marquise_1.jpg',
    }
    addToCart(product)
    showSuccess('Product added to cart!')
    // Trigger cart update
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-800">Home</Link>
            {' / '}
            <Link href="/engagement-rings" className="hover:text-primary-800">Engagement Rings</Link>
            {' / '}
            <span className="text-gray-900">Marquise Solitaire</span>
          </nav>
        </div>
      </section>

      <div className="container-custom max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Product Image */}
          <div className="lg:col-span-2">
            <div 
              className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative group cursor-zoom-in max-w-md mx-auto lg:mx-0"
              onMouseMove={(e) => {
                if (isZoomed) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  setMousePosition({ x, y })
                }
              }}
              onMouseEnter={() => {
                // Only enable zoom if mouse enters and stays (not clicking buttons)
                if (!isZoomed) {
                  const timer = setTimeout(() => {
                if (!document.activeElement || document.activeElement.tagName !== 'BUTTON') {
                  setIsZoomed(true)
                }
              }, 300) // Small delay to detect if user is moving to click a button
              return () => clearTimeout(timer)
                }
              }}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={(e) => {
                // Only toggle zoom if clicking on the image itself, not buttons
                const target = e.target as HTMLElement
                if (target.tagName !== 'BUTTON' && !target.closest('button')) {
                  setIsZoomed(!isZoomed)
                }
              }}
            >
              <Image
                src={mainImage}
                alt="Marquise Solitaire Engagement Ring"
                fill
                className={`object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
                unoptimized
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                  setIsZoomed(false)
                }}
                onMouseEnter={() => setIsZoomed(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                  setIsZoomed(false)
                }}
                onMouseEnter={() => setIsZoomed(false)}
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
                    alt={`Marquise Solitaire - View ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Customization */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Marquise Solitaire Engagement Ring
            </h1>
            <p className="text-2xl font-semibold text-primary-800 mb-6">
              £{totalPrice.toLocaleString()}
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              This 2 Prong, 3 Prong Solitaire features a Marquise, Pear centre stone weighing {selections.carat.toFixed(2)} ct.wt.. The diamond's {selectedColor?.grade} colour and {selections.clarity} clarity provide brilliance and fire. Crafted in {selectedMetal?.name}, this solitaire ring represents timeless elegance. The two-prong setting enhances the diamond's visibility while maintaining structural integrity, creating a balanced design with timeless appeal.
            </p>

            {/* Metal Selection */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">
                  Metal: <span className="font-normal text-gold-500">{selectedMetal?.name}</span>
                </h3>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600">−</button>
                  <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {metals.map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => updateSelection('metal', metal.id)}
                    className={`flex items-center gap-3 border-2 rounded-md px-4 py-3 text-left transition-all ${
                      selections.metal === metal.id
                        ? 'border-primary-900 bg-gray-100'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: metal.color, border: '1px solid #ccc' }}
                    />
                    <span className="font-medium text-gray-900">{metal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carat Selection */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">
                  Total Carat: <span className="font-normal text-gold-500">{selections.carat.toFixed(2)}ct</span>
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This is how to measure the weight of the diamond. The Carat weight can influence the size of the diamond, a 0.30ct is smaller than a 1.00ct. Use the sliders to see the change.
              </p>
              <div className="relative">
                <input
                  type="range"
                  min="0.30"
                  max="4.00"
                  step="0.10"
                  value={Number(selections.carat)}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    // Round to 2 decimal places to ensure precision
                    const roundedValue = Math.round(newValue * 100) / 100
                    updateSelection('carat', roundedValue)
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-custom"
                  style={{
                    background: `linear-gradient(to right, #d4a574 0%, #d4a574 ${((Number(selections.carat) - 0.30) / (4.00 - 0.30)) * 100}%, #e5e7eb ${((Number(selections.carat) - 0.30) / (4.00 - 0.30)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <style jsx>{`
                  .slider-custom::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                  .slider-custom::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  }
                `}</style>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">
                  Colour: <span className="font-normal text-gold-500">{selections.color}</span>
                </h3>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
              </div>
              <input
                type="range"
                min="0"
                max={colorGrades.length - 1}
                value={colorGrades.findIndex((c) => c.grade === selections.color)}
                onChange={(e) => updateSelection('color', colorGrades[parseInt(e.target.value)].grade)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #fbbf24 0%, #fde047 50%, #ffffff 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {colorGrades.map((color) => (
                  <div key={color.grade} className="flex flex-col items-center">
                    <span>{color.grade}</span>
                    {color.priceAdjustment > 0 && (
                      <span className="text-green-600">+£{color.priceAdjustment.toFixed(2)}</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {selectedColor?.description}
              </p>
            </div>

            {/* Clarity Selection */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">
                  Clarity: <span className="font-normal text-gold-500">{selections.clarity}</span>
                </h3>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Refers to the visibility of inclusions and blemishes that affects a diamonds appearance. The inclusions are nature's finger print and make every diamond beautifully unique.
              </p>
              <div className="grid grid-cols-4 gap-3">
                {clarityGrades.map((clarity) => (
                  <button
                    key={clarity.grade}
                    onClick={() => updateSelection('clarity', clarity.grade)}
                    className={`relative border-2 rounded-md p-4 transition-all ${
                      selections.clarity === clarity.grade
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {/* Diamond illustration with inclusions */}
                    <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-2 flex items-center justify-center relative overflow-hidden">
                      {clarity.inclusions === 'many' && (
                        <>
                          <div className="absolute w-2 h-2 bg-black rounded-full top-4 left-4"></div>
                          <div className="absolute w-1.5 h-1.5 bg-black rounded-full top-8 right-6"></div>
                          <div className="absolute w-2 h-2 bg-black rounded-full bottom-6 left-6"></div>
                          <div className="absolute w-1.5 h-1.5 bg-black rounded-full bottom-4 right-4"></div>
                        </>
                      )}
                      {clarity.inclusions === 'some' && (
                        <>
                          <div className="absolute w-1.5 h-1.5 bg-black rounded-full top-6 left-6"></div>
                          <div className="absolute w-1 h-1 bg-black rounded-full bottom-6 right-6"></div>
                          <div className="absolute w-1.5 h-1.5 bg-black rounded-full bottom-5 left-5"></div>
                        </>
                      )}
                      {clarity.inclusions === 'few' && (
                        <>
                          <div className="absolute w-1 h-1 bg-black rounded-full top-7 left-7"></div>
                          <div className="absolute w-1 h-1 bg-black rounded-full bottom-7 right-7"></div>
                        </>
                      )}
                      {clarity.inclusions === 'very-few' && (
                        <div className="absolute w-0.5 h-0.5 bg-black rounded-full top-8 left-8"></div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-center mb-1">{clarity.grade}</p>
                    {clarity.priceAdjustment > 0 && (
                      <p className="text-xs text-green-600 text-center">+£{clarity.priceAdjustment.toFixed(2)}</p>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {selectedClarity?.description}
              </p>
            </div>

            {/* Cut Selection */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">
                  Cut: <span className="font-normal text-gold-500">{selections.cut}</span>
                </h3>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {cutGrades.map((cut) => (
                  <button
                    key={cut.grade}
                    onClick={() => updateSelection('cut', cut.grade)}
                    className={`border-2 rounded-md p-4 text-center transition-all ${
                      selections.cut === cut.grade
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-primary-900 mb-1">{cut.grade}</p>
                    {cut.priceAdjustment > 0 && (
                      <p className="text-sm text-green-600">+£{cut.priceAdjustment.toFixed(2)}</p>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {selectedCut?.description}
              </p>
            </div>

            {/* Certificate Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-900">
                  Certificate: <span className="font-normal text-gold-500">{selectedCertificate?.name}</span>
                </h3>
                <button className="text-gray-400 hover:text-gray-600">ⓘ</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => updateSelection('certificate', cert.id)}
                    className={`border-2 rounded-md px-4 py-3 text-center transition-all ${
                      selections.certificate === cert.id
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-medium text-primary-900">{cert.name}</p>
                    {cert.priceAdjustment > 0 && (
                      <p className="text-xs text-green-600 mt-1">+£{cert.priceAdjustment}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-4 px-6 rounded-sm transition-colors mb-4"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarquiseTrilogyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading product configuration...</p>
      </div>
    }>
      <MarquiseTrilogyContent />
    </Suspense>
  )
}
