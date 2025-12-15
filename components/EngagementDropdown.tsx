'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  FaRing,
  FaGem,
  FaCircle,
  FaCircleNotch,
  FaHeart,
  FaStar,
  FaUser,
  FaMedal,
  FaTag
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi2'

interface DropdownItem {
  name: string
  href: string
  icon?: React.ReactNode
  color?: string
}

const styles: DropdownItem[] = [
  { name: 'Solitaire', href: '/engagement-rings?style=solitaire', icon: <FaRing className="text-xs" /> },
  { name: 'Side Stone', href: '/engagement-rings?style=side-stone', icon: <FaGem className="text-xs" /> },
  { name: 'Halo', href: '/engagement-rings?style=halo', icon: <FaCircle className="text-xs" /> },
  { name: 'Trilogy', href: '/engagement-rings?style=trilogy', icon: <FaCircleNotch className="text-xs" /> },
  { name: 'Cluster', href: '/engagement-rings?style=cluster', icon: <FaStar className="text-xs" /> },
  { name: 'Vintage', href: '/engagement-rings?style=vintage', icon: <FaStar className="text-xs" /> },
  { name: 'Ethereal', href: '/engagement-rings?style=ethereal', icon: <HiSparkles className="text-xs" /> },
  { name: 'Bridal Set', href: '/engagement-rings?style=bridal-set', icon: <FaHeart className="text-xs" /> },
  { name: "Women's", href: '/engagement-rings?category=womens', icon: <FaUser className="text-xs" /> },
  { name: "Men's", href: '/engagement-rings?category=mens', icon: <FaUser className="text-xs" /> },
  { name: 'Gemstone', href: '/engagement-rings?category=gemstone', icon: <FaGem className="text-xs" /> },
]

const stones: DropdownItem[] = [
  { name: 'Natural Diamond', href: '/engagement-rings?stone=natural-diamond', color: '#ffffff' },
  { name: 'Lab Grown', href: '/engagement-rings?stone=lab-grown', color: '#ffffff' },
  { name: 'Moissanite', href: '/engagement-rings?stone=moissanite', color: '#ffffff' },
  { name: 'Yellow Diamond', href: '/engagement-rings?stone=yellow-diamond', color: '#fbbf24' },
  { name: 'Black Diamond', href: '/engagement-rings?stone=black-diamond', color: '#1f2937' },
  { name: 'Champagne Diamond', href: '/engagement-rings?stone=champagne-diamond', color: '#d4a574' },
]

const shapes: DropdownItem[] = [
  { name: 'Marquise', href: '/engagement-rings?shape=marquise' },
  { name: 'Round', href: '/engagement-rings?shape=round' },
  { name: 'Princess', href: '/engagement-rings?shape=princess' },
  { name: 'Cushion', href: '/engagement-rings?shape=cushion' },
  { name: 'Emerald', href: '/engagement-rings?shape=emerald' },
  { name: 'Pear', href: '/engagement-rings?shape=pear' },
  { name: 'Oval', href: '/engagement-rings?shape=oval' },
  { name: 'Baguette', href: '/engagement-rings?shape=baguette' },
]

const metals: DropdownItem[] = [
  { name: 'White Gold', href: '/engagement-rings?metal=white-gold', color: '#f0f0f0' },
  { name: 'Yellow Gold', href: '/engagement-rings?metal=yellow-gold', color: '#ffd700' },
  { name: 'Rose Gold', href: '/engagement-rings?metal=rose-gold', color: '#e8b4a0' },
]

export default function EngagementDropdown() {
  return (
    <div className="w-max max-w-6xl bg-white border border-gray-200 shadow-xl py-6 px-8">
      <div className="grid grid-cols-4 gap-8">

        {/* SHAPES Column */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            SHAPES
          </h3>
          <ul className="space-y-2">
            {shapes.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-gray-700 hover:text-gold-500 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* METAL Column */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            METAL
          </h3>
          <ul className="space-y-2">
            {metals.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gold-500 transition-colors group"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Images Column */}
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link href="/engagement-rings?category=womens" className="group">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center mb-2 hover:shadow-md transition-shadow">
                <FaRing className="text-2xl text-gray-400 group-hover:text-gold-500 transition-colors" />
              </div>
              <p className="text-xs text-center text-gray-600 font-medium">
                Women's Ring
              </p>
            </Link>
            <Link href="/engagement-rings?category=mens" className="group">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center mb-2 hover:shadow-md transition-shadow">
                <FaRing className="text-2xl text-gray-400 group-hover:text-gold-500 transition-colors" />
              </div>
              <p className="text-xs text-center text-gray-600 font-medium">
                Men's Ring
              </p>
            </Link>
            <Link href="/engagement-rings?category=bespoke" className="group">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center mb-2 hover:shadow-md transition-shadow">
                <FaMedal className="text-2xl text-gray-400 group-hover:text-gold-500 transition-colors" />
              </div>
              <p className="text-xs text-center text-gray-600 font-medium">
                Bespoke Ring
              </p>
            </Link>
            <Link href="/engagement-rings?on-sale=true" className="group">
              <div className="aspect-square bg-gradient-to-br from-red-50 to-red-100 rounded-md flex items-center justify-center mb-2 hover:shadow-md transition-shadow">
                <FaTag className="text-2xl text-red-400 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-xs text-center text-gray-600 font-medium">
                Sale
              </p>
            </Link>
          </div>
          <Link
            href="/engagement-rings/guide"
            className="text-xs text-center text-gold-500 hover:text-gold-600 font-semibold uppercase tracking-wide block mt-4"
          >
            INFO & ADVICE ENGAGEMENT RING
          </Link>
        </div>
      </div>
    </div>
  )
}
