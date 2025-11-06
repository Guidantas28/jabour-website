'use client'

import Link from 'next/link'
import { Suspense } from 'react'

function BraceletsContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white section-padding">
        <div className="container-custom">
          <h1 className="text-5xl font-serif font-bold text-primary-900 mb-4">
            Bracelets
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover our exquisite collection of bespoke bracelets, crafted with precision
            and care in our Hatton Garden workshop.
          </p>
        </div>
      </section>

      {/* Empty State */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center py-12">
          <p className="text-lg text-gray-600 mb-8">
            Our bracelets collection is coming soon.
          </p>
          <Link href="/book-appointment" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Book a free consultation with our experts to create a bespoke piece.
          </p>
          <Link href="/book-appointment" className="btn-primary">
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function BraceletsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <BraceletsContent />
    </Suspense>
  )
}


