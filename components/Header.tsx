'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { FaSearch, FaHeart, FaShoppingBag, FaChevronDown, FaUser } from 'react-icons/fa'
import Cart from './Cart'
import EngagementDropdown from './EngagementDropdown'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const mainNavigation = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'EDUCATION', href: '/education' },
    { name: 'BLOG', href: '/blog' },
    { name: 'VIP CONSULTATION', href: '/vip-consultation' },
    { name: 'WARRANTY', href: '/warranty-policy' },
    { name: 'CONTACT US', href: '/contact' },
  ]

  const categoryNavigation = [
    { name: 'ENGAGEMENT RINGS', href: '/engagement-rings', hasDropdown: true },
    { name: 'DIAMOND RINGS', href: '/diamonds', hasDropdown: true },
    { name: 'WEDDING RINGS', href: '/wedding-rings', hasDropdown: false },
    { name: 'EARRINGS', href: '/jewellery/earrings', hasDropdown: false },
    { name: 'PENDANTS', href: '/jewellery/pendants', hasDropdown: false },
    { name: 'BRACELETS', href: '/jewellery/bracelets', hasDropdown: false },
    { name: 'GEMSTONES', href: '/jewellery/gemstones', hasDropdown: false },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full left-0 right-0">
      <nav className="container-custom w-full">
        {/* Logo Section - Centered */}
        <div className="flex justify-center py-6 border-b border-gray-200">
          <Link href="/" className="relative h-16 w-auto">
            <Image
              src="/images/logo-jabour-new.png"
              alt="Jabour & Co"
              width={200}
              height={80}
              className="h-full w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors relative ${
                  isActive(item.href)
                    ? 'text-gray-900'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold-500"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Navigation - Account & Icons */}
          <div className="flex items-center space-x-6">
            <Link
              href="/my-account"
              className="hidden md:flex items-center space-x-2 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FaUser className="text-sm" />
              <span>MY ACCOUNT</span>
            </Link>
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-lg" />
            </button>
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors relative"
              aria-label="Wishlist"
            >
              <FaHeart className="text-lg" />
            </button>
            <Cart />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Category Navigation */}
        <div className="hidden lg:flex items-center space-x-6 py-3">
          {categoryNavigation.map((item) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center space-x-1 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <FaChevronDown className="text-xs" />
                )}
              </Link>
              {item.hasDropdown && activeDropdown === item.name && (
                <div 
                  className="absolute top-full left-0 mt-0 z-50 max-w-screen-xl"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.name === 'ENGAGEMENT RINGS' && <EngagementDropdown />}
                  {item.name === 'DIAMOND RINGS' && (
                    <div className="bg-white border border-gray-200 shadow-lg rounded-md py-2 w-48">
                      <Link href="/diamonds" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Natural Diamonds
                      </Link>
                      <Link href="/diamonds/lab-grown" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Lab Grown Diamonds
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold uppercase tracking-wide px-4 py-2 ${
                    isActive(item.href)
                      ? 'text-gray-900 border-l-4 border-gold-500'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Categories
                </p>
                {categoryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-sm font-semibold uppercase tracking-wide text-gray-700 px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
