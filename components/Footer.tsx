'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full left-0 right-0">
      {/* Main Footer Section with Light Gradient */}
      <section 
        className="py-16 px-4"
        style={{
          background: 'linear-gradient(180deg, #B89B7E 0%, #C8AB8E 50%, #D4BFA8 100%)'
        }}
      >
        <div className="container-custom max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <Link href="/" className="block mb-6">
                <Image
                  src="/images/logo-jabour-new.png"
                  alt="Jabour Jewellery"
                  width={180}
                  height={72}
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#3D2E24' }}>
                Crafting exquisite bespoke jewellery with precision and care.
              </p>
              <a
                href="https://www.instagram.com/jabourjewellery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm transition-colors group"
                style={{ color: '#3D2E24' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="text-xl group-hover:scale-110 transition-transform" />
                <span>Follow us on Instagram</span>
              </a>
            </div>

            {/* About Column */}
            <div>
              <h4 className="font-semibold mb-6 text-base uppercase tracking-wide" style={{ color: '#3D2E24' }}>
                About
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href="/about" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/education" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Education
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/vip-consultation" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    VIP Consultation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care Column */}
            <div>
              <h4 className="font-semibold mb-6 text-base uppercase tracking-wide" style={{ color: '#3D2E24' }}>
                Customer Care
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href="/contact" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/book-appointment" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/warranty-policy" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Warranty Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us Column */}
            <div>
              <h4 className="font-semibold mb-6 text-base uppercase tracking-wide" style={{ color: '#3D2E24' }}>
                Contact Us
              </h4>
              <ul className="space-y-3 text-sm">
                <li style={{ color: '#3D2E24' }}>Monday to Friday: 10am - 6:30pm</li>
                <li style={{ color: '#3D2E24' }}>Saturday: 10am - 5pm</li>
                <li className="pt-4">
                  <Link 
                    href="/book-appointment" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="transition-colors block" 
                    style={{ color: '#3D2E24' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Section */}
          <div 
            className="border-t pt-8 mt-12" 
            style={{ borderColor: 'rgba(61, 46, 36, 0.2)' }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm" style={{ color: '#3D2E24' }}>
                © {new Date().getFullYear()} Jabour Jewellery. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link 
                  href="/warranty-policy" 
                  className="text-sm transition-colors" 
                  style={{ color: '#3D2E24' }} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                >
                  Warranty Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm transition-colors" 
                  style={{ color: '#3D2E24' }} 
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6B4F41'} 
                  onMouseLeave={(e) => e.currentTarget.style.color = '#3D2E24'}
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
