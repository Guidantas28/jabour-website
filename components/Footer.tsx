import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-300 w-full left-0 right-0">
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
            <p className="text-sm mb-4">
              Crafting exquisite bespoke jewellery with precision and care.
            </p>
            <a
              href="https://www.instagram.com/jabourjewellery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram className="text-xl" />
              <span>Follow us on Instagram</span>
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-white transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/vip-consultation" className="hover:text-white transition-colors">
                  VIP Consultation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/warranty-policy" className="hover:text-white transition-colors">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday to Friday: 10am - 6:30pm</li>
              <li>Saturday: 10am - 5pm</li>
              <li className="pt-2">
                <Link href="/book-appointment" className="hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Jabour Jewellery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/warranty-policy" className="text-sm hover:text-white transition-colors">
                Warranty Policy
              </Link>
              <Link href="/terms" className="text-sm hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
