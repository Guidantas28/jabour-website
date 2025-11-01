import Link from 'next/link'

export default function WeddingRingsPage() {
  const rings = [
    {
      id: 'classic-plain',
      name: 'Classic Plain',
      category: 'Simple',
      price: 'From £495',
    },
    {
      id: 'diamond-eternity',
      name: 'Diamond Eternity',
      category: 'Diamond',
      price: 'From £1,195',
    },
    {
      id: 'comfort-fit',
      name: 'Comfort Fit',
      category: 'Simple',
      price: 'From £595',
    },
    {
      id: 'twisted-band',
      name: 'Twisted Band',
      category: 'Simple',
      price: 'From £750',
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Wedding Rings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover our beautiful collection of wedding rings for him and her, crafted to complement
            your engagement ring perfectly.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container-custom">
          <div className="flex gap-4">
            <Link href="/wedding-rings" className="font-semibold text-primary-900 border-b-2 border-primary-900 pb-2">
              All Rings
            </Link>
            <Link href="/wedding-rings?category=womens" className="text-gray-600 hover:text-primary-800">
              Women's Wedding Rings
            </Link>
            <Link href="/wedding-rings?category=mens" className="text-gray-600 hover:text-primary-800">
              Men's Wedding Rings
            </Link>
            <Link href="/wedding-rings?category=eternity" className="text-gray-600 hover:text-primary-800">
              Eternity Rings
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rings.map((ring) => (
              <Link
                key={ring.id}
                href={`/wedding-rings/${ring.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="w-24 h-24 border-4 border-primary-800 rounded-full"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-primary-900 mb-2">
                    {ring.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{ring.category}</p>
                  <p className="text-lg font-semibold text-primary-800 mb-4">{ring.price}</p>
                  <button className="btn-secondary w-full">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
