import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Terms and Conditions
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              Please read these Terms and Conditions carefully before using our website or making a purchase. 
              By accessing our website or placing an order, you agree to be bound by these Terms.
            </p>
          </div>

          {/* 1. General Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              1. General Information
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              Jabour Jewellery is a luxury jewellery brand based in the United Kingdom, operating globally
              with a commitment to ethical sourcing, exceptional craftsmanship, and outstanding customer
              service.
            </p>
          </div>

          {/* 2. Orders and Contract Formation */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              2. Orders and Contract Formation
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>All orders placed through our website are subject to availability and acceptance.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>When you place an order, you will receive a confirmation email. This does not constitute acceptance.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>A contract is formed only when you receive a shipping confirmation or other written acceptance from us.</span>
              </li>
            </ul>
          </div>

          {/* 3. Pricing and Payment */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              3. Pricing and Payment
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>All prices are listed in GBP and are inclusive of VAT unless otherwise stated.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We reserve the right to change prices at any time without prior notice.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Payment must be made in full at the time of purchase using our secure checkout.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We accept major credit/debit cards.</span>
              </li>
            </ul>
          </div>

          {/* 4. Shipping and Delivery */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              4. Shipping and Delivery
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We offer worldwide shipping, with free insured delivery included on all orders.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Estimated delivery times are provided for guidance and may vary depending on location and product availability.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Ownership and risk of loss transfer to you upon delivery.</span>
              </li>
            </ul>
          </div>

          {/* 5. Returns and Refunds */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              5. Returns and Refunds
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We offer a no-hassle, full refund on eligible returns made within 30 days of receipt.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Items must be returned in their original, unworn condition, with all packaging and certificates included.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Custom, engraved, or bespoke items may not be eligible for return unless faulty.</span>
              </li>
            </ul>
          </div>

          {/* 6. Product Descriptions and Images */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              6. Product Descriptions and Images
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We strive for accuracy in product descriptions and imagery.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>However, slight variations in colour, weight, or detailing may occur due to the handcrafted nature of our pieces.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We reserve the right to correct errors or omissions on the website at any time.</span>
              </li>
            </ul>
          </div>

          {/* 7. Ethical Sourcing and Conflict-Free Policy */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              7. Ethical Sourcing and Conflict-Free Policy
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Jabour Jewellery is fully committed to sourcing diamonds and materials ethically.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>All our suppliers adhere to the Kimberley Process and World Diamond Council System of Warranties.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We do not support or engage in any trade involving conflict diamonds.</span>
              </li>
            </ul>
          </div>

          {/* 8. Intellectual Property */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              8. Intellectual Property
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>All content on our website, including designs, logos, text, images, and videos, is the intellectual property of Jabour Jewellery or its licensors.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>You may not reproduce, distribute, or commercially exploit any content without prior written consent.</span>
              </li>
            </ul>
          </div>

          {/* 9. Limitation of Liability */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              9. Limitation of Liability
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Jabour Jewellery shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or purchase of our products.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Our liability is strictly limited to the purchase price of the product in question.</span>
              </li>
            </ul>
          </div>

          {/* 10. Privacy and Data Protection */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              10. Privacy and Data Protection
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>We are committed to protecting your privacy and complying with the UK GDPR and other applicable data protection laws.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Please review our <Link href="/privacy" className="text-gold-500 hover:text-gold-600 underline">Privacy Policy</Link> for more information on how we collect, store, and use your personal data.</span>
              </li>
            </ul>
          </div>

          {/* 11. Governing Law and Jurisdiction */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              11. Governing Law and Jurisdiction
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>These Terms shall be governed by and construed in accordance with the laws of England and Wales.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Any disputes arising shall be subject to the exclusive jurisdiction of the courts of England.</span>
              </li>
            </ul>
          </div>

          {/* 12. Changes to These Terms */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
              12. Changes to These Terms
            </h2>
            <ul className="space-y-4 pl-6">
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>Jabour Jewellery reserves the right to update these Terms at any time.</span>
              </li>
              <li className="text-gray-700 leading-relaxed font-light flex items-start">
                <span className="text-gold-500 mr-3 mt-1">●</span>
                <span>You are advised to review this page periodically to stay informed of any changes.</span>
              </li>
            </ul>
          </div>

          {/* Closing */}
          <div className="text-center pt-12">
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-8">
              If you have any questions about these Terms and Conditions, please contact us at{' '}
              <a href="mailto:info@jabourjewellery.com" className="text-gold-500 hover:text-gold-600 underline">
                info@jabourjewellery.com
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-sm font-semibold transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/warranty-policy"
                className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-sm font-semibold transition-colors"
              >
                View Warranty Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

