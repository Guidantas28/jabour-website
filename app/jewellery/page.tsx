export default function JewelleryPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Jewellery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore our exquisite collection of fine jewellery, from diamond earrings
            to elegant pendants and eternity rings.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Diamond Earrings', href: '/jewellery/earrings' },
              { name: 'Diamond Pendants', href: '/jewellery/pendants' },
              { name: 'Eternity Rings', href: '/jewellery/eternity-rings' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-2xl font-serif font-bold text-primary-900 group-hover:scale-110 transition-transform">
                    {item.name}
                  </h2>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
