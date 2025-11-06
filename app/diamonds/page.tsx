import Link from 'next/link'

export default function DiamondsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Diamonds
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore our collection of ethically sourced natural and lab grown diamonds,
            all certified and ready to be set in your perfect ring.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Link href="/diamonds/natural" className="group relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Natural Diamonds</h2>
                <p className="text-lg text-gray-700">Search our collection</p>
              </div>
            </Link>
            <Link href="/diamonds/lab-grown" className="group relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Lab Grown Diamonds</h2>
                <p className="text-lg text-gray-700">Search our collection</p>
              </div>
            </Link>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
              Shop diamonds by shape
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {['Round', 'Oval', 'Cushion', 'Pear', 'Emerald', 'Princess', 'Heart', 'Marquise'].map((shape) => (
                <Link
                  key={shape}
                  href={`/diamonds?shape=${shape.toLowerCase()}`}
                  className="text-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-800 transition-colors"
                >
                  <div className="w-16 h-16 border-2 border-primary-800 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium">{shape}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              Lab Grown vs Natural Diamonds
            </h3>
            <p className="text-gray-700 mb-6">
              Both lab grown and natural diamonds are real diamonds, chemically identical. Lab grown diamonds
              offer excellent value and are more sustainable, while natural diamonds have a unique history
              spanning millions of years.
            </p>
            <Link href="/education/lab-grown-diamonds" className="text-primary-800 font-semibold hover:underline">
              Learn more in our diamond guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
