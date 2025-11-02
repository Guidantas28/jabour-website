'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface RingSelection {
  style: string
  metal: string
  profile: string
  width: string
  size: string
  weight: string
  polish: string
}

const styles = [
  { id: 'classic', name: 'CLASSIC', image: '/rings/classic.jpg' },
  { id: 'diamond-cut', name: 'DIAMOND CUT', image: '/rings/diamond-cut.jpg' },
  { id: 'two-colour', name: 'TWO COLOUR', image: '/rings/two-colour.jpg' },
  { id: 'diamond-set', name: 'DIAMOND SET', image: '/rings/diamond-set.jpg' },
  { id: 'eternity', name: 'ETERNITY', image: '/rings/eternity.jpg' },
  { id: 'vintage', name: 'VINTAGE', image: '/rings/vintage.jpg' },
  { id: 'engraved', name: 'ENGRAVED', image: '/rings/engraved.jpg' },
]

const metals = [
  { id: '18k-yellow', name: '18K YELLOW', color: '#fbbf24', price: 50 },
  { id: '9k-white', name: '9K WHITE', color: '#f9fafb', price: 40 },
  { id: '18k-red', name: '18K RED', color: '#e879f9', price: 50 },
  { id: '9k-spot-yellow', name: '9K SPOT YELLOW', color: '#fde047', price: 35 },
  { id: '18k-white', name: '18K WHITE', color: '#ffffff', price: 50 },
  { id: '18k-rose', name: 'LADY RED', color: '#f472b6', price: 50 },
  { id: '999', name: '999', color: '#fbbf24', price: 55 },
  { id: '22k-white', name: '22K WHITE', color: '#ffffff', price: 60 },
  { id: '22k-red', name: '22K RED', color: '#f472b6', price: 60 },
  { id: '22k-spot-yellow', name: '22K SPOT YELLOW', color: '#fde047', price: 60 },
  { id: 'palladium', name: 'PALLADIUM', color: '#e5e7eb', price: 70 },
  { id: 'platinum', name: 'PLATINUM', color: '#d1d5db', price: 80 },
]

const profiles = [
  { id: 'traditional-court', name: 'TRADITIONAL COURT', image: '/rings/profile-traditional.jpg' },
  { id: 'flat-court', name: 'FLAT COURT', image: '/rings/profile-flat.jpg' },
  { id: 'soft-court', name: 'SOFT COURT', image: '/rings/profile-soft.jpg' },
  { id: 'premium-court', name: 'PREMIUM COURT', image: '/rings/profile-premium.jpg' },
  { id: 'flat', name: 'FLAT', image: '/rings/profile-flat.jpg' },
  { id: 'd-shape', name: 'D-SHAPE', image: '/rings/profile-dshape.jpg' },
]

const widths = [
  { id: '2mm', name: '2MM', value: 2 },
  { id: '3mm', name: '3MM', value: 3 },
  { id: '4mm', name: '4MM', value: 4 },
  { id: '5mm', name: '5MM', value: 5 },
  { id: '6mm', name: '6MM', value: 6 },
  { id: '7mm', name: '7MM', value: 7 },
  { id: '8mm', name: '8MM', value: 8 },
]

const sizes = [
  'M', 'M 1/2', 'N', 'N 1/2', 'O', 'O 1/2',
  'P', 'P 1/2', 'Q', 'Q 1/2', 'R', 'R 1/2',
  'S', 'S 1/2', 'T', 'T 1/2', 'U', 'U 1/2',
  'V', 'V 1/2', 'W', 'W 1/2', 'X', 'X 1/2',
  'Y', 'Y 1/2', 'Z', 'Z 1/2',
]

const weights = [
  { id: 'light', name: 'LIGHT', value: '1.00G', price: 0 },
  { id: 'medium', name: 'MEDIUM', value: '2.00G', price: 50 },
  { id: 'heavy', name: 'HEAVY', value: '3.00G', price: 100 },
  { id: 'extra-heavy', name: 'EXTRA HEAVY', value: '3.5G', price: 150 },
]

const polishes = [
  { id: 'polished', name: 'POLISHED', image: '/rings/polish-polished.jpg' },
  { id: 'heavy-matt', name: 'HEAVY MATT', image: '/rings/polish-heavymatt.jpg' },
  { id: 'light-matt', name: 'LIGHT MATT', image: '/rings/polish-lightmatt.jpg' },
  { id: 'brushed', name: 'BRUSHED', image: '/rings/polish-brushed.jpg' },
  { id: 'engraved', name: 'ENGRAVED', image: '/rings/polish-engraved.jpg' },
]

export default function DesignYourOwnPage() {
  const [selection, setSelection] = useState<RingSelection>({
    style: 'classic',
    metal: '18k-yellow',
    profile: 'traditional-court',
    width: '2mm',
    size: 'P 1/2',
    weight: 'light',
    polish: 'polished',
  })

  const updateSelection = (key: keyof RingSelection, value: string) => {
    setSelection((prev) => ({ ...prev, [key]: value }))
  }

  // Calculate price
  const basePrice = 200
  const selectedMetal = metals.find((m) => m.id === selection.metal)
  const selectedWeight = weights.find((w) => w.id === selection.weight)
  const metalPrice = selectedMetal?.price || 0
  const weightPrice = selectedWeight?.price || 0
  const totalPrice = basePrice + metalPrice + weightPrice
  const highStreetPrice = Math.round(totalPrice * 1.5)
  const savings = highStreetPrice - totalPrice

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container-custom max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-800">Home</Link>
            {' / '}
            <Link href="/wedding-rings" className="hover:text-primary-800">Wedding Rings</Link>
            {' / '}
            <span className="text-gray-900">Design Your Own Wedding Ring</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-white pt-12 pb-8">
        <div className="container-custom max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            DESIGN YOUR OWN WEDDING RING
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed font-light max-w-4xl">
            Create a truly unique wedding ring that reflects your personal style. Our interactive designer allows you to customise every aspect of your ring, from the metal and width to the profile and finish. Each ring is handcrafted to perfection, ensuring exceptional quality and a piece that symbolises your commitment perfectly.
          </p>
        </div>
      </section>

      <div className="container-custom max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-12">
            {/* STEP 1: STYLE */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 1: STYLE
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  FROM CLASSICAL SIMPLICITY TO STYLISH CONTEMPORARY DESIGNS - THE CHOICE IS YOURS.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateSelection('style', style.id)}
                    className={`flex-shrink-0 w-32 h-32 rounded-sm border-2 transition-all ${
                      selection.style === style.id
                        ? 'border-gold-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-100 rounded-sm flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">{style.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 2: METAL */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 2: METAL
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  COLOUR, TRADITION, PRESTIGE - MAKE A STATEMENT WITH YOUR RING.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {metals.map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => updateSelection('metal', metal.id)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-sm border-2 transition-all ${
                      selection.metal === metal.id
                        ? 'border-gold-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: metal.color }}
                    />
                    <span className="text-xs font-medium text-gray-700 text-center">{metal.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 3: PROFILE */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 3: PROFILE
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  WHETHER YOU ARE LOOKING FOR SOFT EDGES, COMFORT OR HARSH DEFINED LINES - WE HAVE A PROFILE TO SUIT YOU.
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => updateSelection('profile', profile.id)}
                    className={`flex-shrink-0 w-32 h-32 rounded-sm border-2 transition-all ${
                      selection.profile === profile.id
                        ? 'border-gold-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-100 rounded-sm flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700 text-center px-2">{profile.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 4: WIDTH */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 4: WIDTH
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  DELICATE AND SUBTLE OR A BOLD STATEMENT PIECE - THE CHOICE IS YOURS!
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {widths.map((width) => (
                  <button
                    key={width.id}
                    onClick={() => updateSelection('width', width.id)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-sm border-2 transition-all ${
                      selection.width === width.id
                        ? 'border-gold-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="bg-gray-300 rounded-sm"
                      style={{ width: `${width.value * 4}px`, height: '60px' }}
                    />
                    <span className="text-xs font-medium text-gray-700">{width.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 5: RING SIZE */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 5: RING SIZE
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  SIZES SHOWN ARE MEASURED TO CENTRE
                </p>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSelection('size', size)}
                    className={`py-3 px-4 rounded-sm border-2 transition-all text-sm font-medium ${
                      selection.size === size
                        ? 'border-gold-500 bg-gold-50 text-primary-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 6: WEIGHT */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 6: WEIGHT
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weights.map((weight) => (
                  <button
                    key={weight.id}
                    onClick={() => updateSelection('weight', weight.id)}
                    className={`py-4 px-6 rounded-sm border-2 transition-all ${
                      selection.weight === weight.id
                        ? 'border-gold-500 bg-gold-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold text-primary-900 mb-1">{weight.name}</p>
                      <p className="text-sm text-gray-600">({weight.value})</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* STEP 7: PERSONALISE */}
            <section className="bg-white border border-gray-200 rounded-sm p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                  STEP 7: PERSONALISE
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  POLISHING/TEXTURE
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {polishes.map((polish) => (
                  <button
                    key={polish.id}
                    onClick={() => updateSelection('polish', polish.id)}
                    className={`flex-shrink-0 w-32 h-32 rounded-sm border-2 transition-all ${
                      selection.polish === polish.id
                        ? 'border-gold-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-100 rounded-sm flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700 text-center px-2">{polish.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* YOUR DESIGN - Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-sm p-8 shadow-lg">
              <h2 className="text-2xl font-serif font-normal text-primary-900 mb-6">
                YOUR DESIGN
              </h2>

              {/* Ring Image */}
              <div className="mb-6">
                <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center mb-4">
                  <div className="w-32 h-32 border-4 border-primary-800 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Drag to spin (3D view coming soon)
                </p>
              </div>

              {/* Specifications */}
              <div className="space-y-3 mb-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Metal:</span>
                  <span className="font-medium text-primary-900">
                    {metals.find((m) => m.id === selection.metal)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Width:</span>
                  <span className="font-medium text-primary-900">{selection.width.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium text-primary-900">{selection.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Polishing/Texture:</span>
                  <span className="font-medium text-primary-900">
                    {polishes.find((p) => p.id === selection.polish)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile:</span>
                  <span className="font-medium text-primary-900">
                    {profiles.find((p) => p.id === selection.profile)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium text-primary-900">
                    {weights.find((w) => w.id === selection.weight)?.name}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-4xl font-serif font-normal text-primary-900 mb-2">
                  £{totalPrice.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 line-through mb-1">
                  High Street Price: £{highStreetPrice.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gold-500 mb-4">
                  You Save: £{savings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Prices include VAT</p>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-primary-900 hover:bg-primary-800 text-white font-semibold py-4 px-6 rounded-sm transition-colors">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
