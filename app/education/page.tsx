import Link from 'next/link'
import Image from 'next/image'
import { FaGem, FaCircle, FaCertificate, FaFlask, FaMedal } from 'react-icons/fa'

const educationTopics = [
  {
    id: 'shape',
    title: 'Shape',
    icon: <FaGem className="text-4xl text-gold-500" />,
    image: '/images/education/shape.jpg',
  },
  {
    id: 'carat',
    title: 'Carat',
    icon: <FaCircle className="text-4xl text-gold-500" />,
    image: '/images/education/carat.jpg',
  },
  {
    id: 'colour',
    title: 'Colour',
    icon: <FaGem className="text-4xl text-gold-500" />,
    image: '/images/education/colour.jpg',
  },
  {
    id: 'clarity',
    title: 'Clarity',
    icon: <FaGem className="text-4xl text-gold-500" />,
    image: '/images/education/clarity.jpg',
  },
  {
    id: 'cut',
    title: 'Cut',
    icon: <FaCircle className="text-4xl text-gold-500" />,
    image: '/images/education/cut.jpg',
  },
  {
    id: 'certificates',
    title: 'Certificates',
    icon: <FaCertificate className="text-4xl text-gold-500" />,
    image: '/images/education/certificates.jpg',
  },
  {
    id: 'lab-grown-diamonds',
    title: 'Lab Grown Diamonds',
    icon: <FaFlask className="text-4xl text-gold-500" />,
    image: '/images/education/lab-grown.jpg',
  },
  {
    id: 'precious-metal',
    title: 'Precious Metal',
    icon: <FaMedal className="text-4xl text-gold-500" />,
    image: '/images/education/precious-metal.jpg',
  },
]

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Education
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-700 mb-4 leading-relaxed max-w-3xl mx-auto">
            Choosing the perfect engagement ring for your partner is a thrilling experience but can also feel quite daunting to begin with. Don't panic, the perfect engagement ring is here waiting for you, and our engagement ring buying guide will help you on your journey to the perfect diamond ring.
          </p>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {educationTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/education/${topic.id}`}
                className="group relative bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-gold-500"
              >
                <div className="aspect-square p-8 flex flex-col items-center justify-center">
                  {/* Image placeholder or icon */}
                  <div className="w-full h-48 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm flex items-center justify-center">
                    {topic.icon || (
                      <div className="text-6xl text-gray-300">
                        <FaGem />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-normal text-primary-900 text-center group-hover:text-gold-500 transition-colors">
                    {topic.title}
                  </h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 transition-colors pointer-events-none"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50 py-16">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Still Have Questions?
          </h2>
          <p className="text-lg font-light text-gray-700 mb-8 max-w-2xl mx-auto">
            Our experts are here to guide you through every step of your journey.
          </p>
          <Link
            href="/book-appointment"
            className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider transition-colors"
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
