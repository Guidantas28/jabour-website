import Link from 'next/link'
import Image from 'next/image'
import { 
  FaHammer, 
  FaLeaf, 
  FaCertificate, 
  FaShieldAlt, 
  FaRulerCombined, 
  FaUndo 
} from 'react-icons/fa'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/images/hero/videohero.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-wide">
              Timeless Elegance<br />
              <span className="font-normal">Find Your Sparkle</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Discover jewellery that captures light, beauty, and emotion,<br />
              timeless pieces to treasure forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/engagement-rings" className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-sm font-light text-sm uppercase tracking-wider transition-colors min-w-[200px]">
                Shop Engagement Rings
              </Link>
              <Link href="/book-appointment" className="bg-transparent border border-white/50 text-white px-6 py-3 rounded-sm font-light text-sm uppercase tracking-wider hover:bg-white/10 transition-colors min-w-[200px]">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FaHammer className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Crafted In London</h3>
            </div>
            <div className="flex flex-col items-center">
              <FaLeaf className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Ethical Sourcing</h3>
            </div>
            <div className="flex flex-col items-center">
              <FaCertificate className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Certified Diamonds</h3>
            </div>
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Lifetime Warranty</h3>
            </div>
            <div className="flex flex-col items-center">
              <FaRulerCombined className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">Free Resizing</h3>
            </div>
            <div className="flex flex-col items-center">
              <FaUndo className="text-4xl text-gold-500 mb-4" />
              <h3 className="font-semibold text-primary-900 mb-2">40 Days Returns</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary-900 mb-4">
              Start creating your ring
            </h2>
            <p className="text-lg text-gray-600">
              You're three simple steps away from creating the perfect ring.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Ring Designs</h3>
              <p className="text-gray-600">
                Browse our collection of exquisite engagement rings and find your perfect style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book your free appointment</h3>
              <p className="text-gray-600">
                Our experts are on hand to guide you through the options.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Perfect Ring</h3>
              <p className="text-gray-600">
                Work with our master craftsmen to bring your vision to life.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/engagement-rings" className="btn-primary">
              Explore Ring Designs
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-serif font-bold text-primary-900 text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/engagement-rings"
              className="group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Engagement Rings
                </h3>
              </div>
            </Link>
            <Link
              href="/wedding-rings"
              className="group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Wedding Rings
                </h3>
              </div>
            </Link>
            <Link
              href="/diamonds"
              className="group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Lab Grown Diamonds
                </h3>
              </div>
            </Link>
            <Link
              href="/jewellery"
              className="group relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                  Jewellery
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Rings Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-serif font-bold text-primary-900 text-center mb-12">
            Shop popular engagement rings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Classic Solitaire', price: 'From £995', metal: 'Platinum' },
              { name: 'Elegant Halo', price: 'From £1,550', metal: '18k Gold' },
              { name: 'Timeless Trilogy', price: 'From £1,575', metal: 'Platinum' },
              { name: 'Modern Vintage', price: 'From £1,195', metal: 'Rose Gold' },
            ].map((ring, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 border-4 border-primary-800 rounded-full mx-auto mb-4"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">{ring.name}</h3>
                  <p className="text-gray-600 mb-2">{ring.metal}</p>
                  <p className="text-lg font-semibold text-primary-800 mb-4">{ring.price}</p>
                  <Link
                    href={`/engagement-rings/${ring.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="btn-secondary w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="section-padding bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">
            Discover our award-winning service for yourself
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Why Choose Jabour Jewellery?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-900">
              Learn More
            </Link>
            <Link href="/book-appointment" className="btn-primary bg-white text-primary-900 hover:bg-primary-50">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
