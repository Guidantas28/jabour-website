'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full left-0 right-0" style={{ backgroundColor: '#c69d73' }}>
      <div className="container-custom section-padding w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="block mb-4">
              <Image
                src="/images/logo-jabour-new.png"
                alt="Jabour Jewellery"
                width={180}
                height={72}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm mb-4" style={{ color: '#e0e0e0' }}>
              Crafting exquisite bespoke jewellery with precision and care.
            </p>
            <a
              href="https://www.instagram.com/jabourjewellery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm transition-colors"
              style={{ color: '#e0e0e0' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}
              aria-label="Follow us on Instagram"
            >
              <FaInstagram className="text-xl" />
              <span>Follow us on Instagram</span>
            </a>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#ffffff' }}>About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/education" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Education
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/vip-consultation" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  VIP Consultation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#ffffff' }}>Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/warranty-policy" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#ffffff' }}>Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li style={{ color: '#e0e0e0' }}>Monday to Friday: 10am - 6:30pm</li>
              <li style={{ color: '#e0e0e0' }}>Saturday: 10am - 5pm</li>
              <li className="pt-2">
                <Link href="/book-appointment" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm" style={{ color: '#e0e0e0' }}>
              © {new Date().getFullYear()} Jabour Jewellery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/warranty-policy" className="text-sm transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                Warranty Policy
              </Link>
              <Link href="/terms" className="text-sm transition-colors" style={{ color: '#e0e0e0' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'} onMouseLeave={(e) => e.currentTarget.style.color = '#e0e0e0'}>
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
