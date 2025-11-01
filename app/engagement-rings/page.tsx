import Link from 'next/link'

export default function EngagementRingsPage() {
  const rings = [
    {
      id: 'classic-solitaire',
      name: 'Classic Solitaire',
      price: 'From £995',
      metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
      image: '/rings/solitaire.jpg',
    },
    {
      id: 'elegant-halo',
      name: 'Elegant Halo',
      price: 'From £1,550',
      metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
      image: '/rings/halo.jpg',
    },
    {
      id: 'timeless-trilogy',
      name: 'Timeless Trilogy',
      price: 'From £1,575',
      metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
      image: '/rings/trilogy.jpg',
    },
    {
      id: 'modern-vintage',
      name: 'Modern Vintage',
      price: 'From £1,195',
      metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
      image: '/rings/vintage.jpg',
    },
    {
      id: 'art-deco',
      name: 'Art Deco',
      price: 'From £1,850',
      metals: ['Platinum', '18k White Gold'],
      image: '/rings/art-deco.jpg',
    },
    {
      id: 'minimalist-band',
      name: 'Minimalist Band',
      price: 'From £1,295',
      metals: ['Platinum', '18k White Gold', '18k Yellow Gold', '18k Rose Gold'],
      image: '/rings/band.jpg',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Engagement Rings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover our exquisite collection of bespoke engagement rings, crafted with precision
            and care in our Hatton Garden workshop.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4">
            <select className="border border-gray-300 rounded-md px-4 py-2">
              <option>All Styles</option>
              <option>Solitaire</option>
              <option>Halo</option>
              <option>Trilogy</option>
              <option>Diamond Band</option>
            </select>
            <select className="border border-gray-300 rounded-md px-4 py-2">
              <option>All Metals</option>
              <option>Platinum</option>
              <option>18k White Gold</option>
              <option>18k Yellow Gold</option>
              <option>18k Rose Gold</option>
            </select>
            <select className="border border-gray-300 rounded-md px-4 py-2">
              <option>All Diamond Shapes</option>
              <option>Round</option>
              <option>Oval</option>
              <option>Princess</option>
              <option>Emerald</option>
              <option>Cushion</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rings.map((ring) => (
              <Link
                key={ring.id}
                href={`/engagement-rings/${ring.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="h-80 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-32 h-32 border-4 border-primary-800 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform"></div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white rounded-full p-2 shadow-md hover:bg-primary-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">
                    {ring.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Available in: {ring.metals.slice(0, 2).join(', ')}
                    {ring.metals.length > 2 && ' + more'}
                  </p>
                  <p className="text-lg font-semibold text-primary-800 mb-4">{ring.price}</p>
                  <button className="btn-secondary w-full">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Book a free consultation with our experts to create a bespoke engagement ring.
          </p>
          <Link href="/book-appointment" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  )
}
