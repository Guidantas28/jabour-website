import Link from 'next/link'

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Our Warranty Policy
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-normal text-primary-900 mb-6">
              Coverage Period: 12 Months Manufacturing Warranty + Lifetime Cleaning & Inspection
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              At Jabour Jewellery, we are dedicated to crafting pieces that last a lifetime and to providing
              ongoing care that reflects that commitment. That's why we offer both a 12-month
              manufacturing warranty and lifetime complimentary cleaning and inspection on all Jabour
              Jewellery purchases.
            </p>
          </div>

          {/* 12-Month Warranty */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              12-Month Manufacturing Warranty
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              We offer a full 12-month warranty on all jewellery purchased from Jabour Jewellery. This
              warranty covers:
            </p>
            <ul className="space-y-4 mb-8 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Manufacturing defects in workmanship or materials</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Structural issues such as faulty settings, clasps, or mountings</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Loose stones due to flawed craftsmanship</span>
              </li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              If a covered issue occurs within 12 months of your purchase, we will repair or replace the item at
              no cost.
            </p>
          </div>

          {/* What Is Not Covered */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              What Is Not Covered
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              This warranty excludes:
            </p>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>General wear and tear, accidental damage, or misuse</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Tarnishing from exposure to water, perfume, or chemicals</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Lost or stolen items</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Damage caused by third-party alterations or repairs</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Loss of stones due to neglect or impact damage</span>
              </li>
            </ul>
          </div>

          {/* Lifetime Cleaning & Inspection */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              Lifetime Complimentary Cleaning & Inspection
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              As part of our ongoing service, we are pleased to offer lifetime free cleaning and inspection
              on all Jabour Jewellery items. We recommend having your pieces professionally inspected
              every 6 to 12 months to ensure their continued brilliance and structural integrity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              This service includes:
            </p>
            <ul className="space-y-4 mb-8 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Ultrasonic or gentle cleaning to restore sparkle</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Visual inspection of prongs, clasps, and settings for signs of wear or loosening</span>
              </li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              To arrange this service, simply contact our customer care team at{' '}
              <a href="mailto:info@jabourjewellery.com" className="text-gold-500 hover:text-gold-600 underline">
                info@jabourjewellery.com
              </a>{' '}
              to schedule your complimentary inspection.
            </p>
          </div>

          {/* How to Make a Claim */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              How to Make a Warranty Claim
            </h2>
            <ol className="space-y-6 pl-6 mb-8">
              <li className="text-lg text-gray-700 leading-relaxed font-light">
                <span className="font-semibold text-primary-900">Email <a href="mailto:info@jabourjewellery.com" className="text-gold-500 hover:text-gold-600 underline">info@jabourjewellery.com</a> with:</span>
                <ul className="mt-4 space-y-3 ml-6">
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-3 mt-1">○</span>
                    <span>Your order number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-3 mt-1">○</span>
                    <span>A brief description of the issue</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-500 mr-3 mt-1">○</span>
                    <span>Clear photographs of the item and any damage</span>
                  </li>
                </ul>
              </li>
              <li className="text-lg text-gray-700 leading-relaxed font-light">
                Our team will review your claim and guide you through the return process if needed.
              </li>
              <li className="text-lg text-gray-700 leading-relaxed font-light">
                If the fault falls under warranty, we will repair or replace your item at no charge.
              </li>
            </ol>
          </div>

          {/* Additional Information */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              Additional Information
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Repairs under warranty do not reset or extend the 12-month coverage period.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>This warranty is offered in addition to your legal rights under the Consumer Rights Act 2015.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Lifetime cleaning and inspection services are complimentary but do not include repairs or replacement of parts.</span>
              </li>
            </ul>
          </div>

          {/* Closing */}
          <div className="text-center pt-12">
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-8">
              We are proud to stand behind the quality of every piece we create. Should you have any
              questions or wish to book a service, please contact us at{' '}
              <a href="mailto:info@jabourjewellery.com" className="text-gold-500 hover:text-gold-600 underline">
                info@jabourjewellery.com
              </a>
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-sm font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

