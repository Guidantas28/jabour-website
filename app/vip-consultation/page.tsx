import Link from 'next/link'
import Image from 'next/image'

export default function VIPConsultationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            Book Your
            <br />
            <span className="font-normal">Jabour Experience</span>
          </h1>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-padding bg-white py-16">
        <div className="container-custom max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed text-center mb-12">
            At Jabour, we believe that choosing your jewellery should be a truly memorable experience. Book your appointment with our experts online and we'll assist you wherever you are. If you prefer an in person consultation, we can arrange it at your most comfortable place or welcome you to our showroom for your appointment. During your appointment, you'll enjoy a personalised experience with one of our jewellery specialists, who will guide you through your chosen piece, ensuring every detail aligns with your taste and occasion.
          </p>
          
          {/* Image */}
          <div className="relative h-96 md:h-[500px] rounded-sm overflow-hidden mb-12">
            <Image
              src="https://psjxvdazipegyfwrvzul.supabase.co/storage/v1/object/public/images/blog/couple-jewelry-shop-paying-with-card.jpg"
              alt="Young couple choosing jewelry at jewelry shop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section-padding bg-gray-50 py-24">
        <div className="container-custom max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-primary-900 mb-8 text-center tracking-tight">
            Your Comfort,
            <br />
            <span className="font-normal">Your Confidence,</span>
            <br />
            <span className="font-light">Your Jewellery</span>
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-3xl mx-auto">
            <p>
              At Jabour, we believe in creating a comfortable and effortless experience for our clients. We understand that choosing the perfect jewellery piece can sometimes feel overwhelming, whether it's selecting the 4Cs of your engagement ring or deciding on the jewellery design that best reflects you.
            </p>
            <p>
              Our online appointment service is designed to make this journey as smooth and reassuring as possible, offering you expert guidance, clarity, and peace of mind. Most importantly, we bring the sparkle to you, wherever you feel most at ease.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-primary-900 mb-8 tracking-tight">
            Ready to Begin
            <br />
            <span className="font-normal">Your Journey?</span>
          </h2>
          <p className="text-lg font-light text-gray-700 mb-12 max-w-2xl mx-auto">
            Book your consultation today and let our experts guide you through creating the perfect piece.
          </p>
          <Link
            href="/book-appointment"
            className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  )
}
