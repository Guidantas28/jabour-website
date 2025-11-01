import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white section-padding pt-32 pb-20">
        <div className="container-custom max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            About Us
          </h1>
          <p className="text-2xl md:text-3xl font-serif font-light text-gold-500 italic mb-4">
            Crafted with Vision, Guided by Emotion
          </p>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Some Words About Us */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-light text-primary-900 mb-6 tracking-tight">
              Some Words
              <br />
              <span className="font-normal">About Us</span>
            </h2>
          </div>
        </div>
      </section>

      {/* Your Jewellery Brand has History */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-4 tracking-tight">
              Your Jewellery Brand
              <br />
              <span className="font-light">has History</span>
            </h2>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-gold-500 italic mt-6 mb-8">
              From Inspiration to Everlasting Craft:
            </h3>
          </div>
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
            <p className="text-xl">
              Our jewellery defies convention fluid curves, bold settings, and deliberate forms; each piece we create challenges the expected and celebrates the exceptional. From bespoke engagement rings to sculptural wedding bands, our jewellery is shaped not by trends, but by vision.
            </p>
            <p>
              Rooted in Brazil's rich tradition of gold and gemstone mastery, and brought to life in the heart of Hatton Garden, our work blends heritage with fearless modernity. Precision, emotion, and individuality guide every creation because luxury, to us, is not a price tag, but a principle.
            </p>
            <p className="text-xl font-normal">
              Every ring, every band, every bespoke design is an expression of enduring artistry. Made to be worn. Made to be remembered. Made for those who live beyond the ordinary.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Founders */}
      <section className="section-padding bg-gray-50 py-24">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-4 tracking-tight">
              Meet Our
              <br />
              <span className="font-light">Founders</span>
            </h2>
            <p className="text-xl md:text-2xl font-serif font-light text-gold-500 italic mt-6 mb-12 max-w-3xl">
              Every piece begins with a feeling. Every design ends in a legacy
            </p>
          </div>
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
            <p>
              We often say that Jabour & Co began long before it became a brand. It started with two dreams, his and hers that were destined to meet. He grew up in Jabour, a lively neighbourhood in Rio de Janeiro. From a young age, he was captivated by the world of jewellery, the shimmer of gemstones, the precision of craftsmanship, and the way a single piece could hold a lifetime of emotion. He always dreamed of one day bringing his passion to London, the home of fine jewellery.
            </p>
            <p>
              I, on the other hand, grew up surrounded by family businesses and learned early the beauty of creating something meaningful. My heart, though, always belonged to jewellery, it was my favourite possession, my way of expressing who I am, and my reminder that love and art can live in the same form.
            </p>
            <p>
              When we met, our worlds just… connected. His artistry, my love for business, and our shared admiration for jewellery naturally became part of our story. And when he designed my engagement ring, the most personal creation of all, we knew it was the beginning of something bigger. That's when the idea for Jabour was born. We wanted to create a brand that would let others feel what we felt, the joy, the love, the meaning behind every detail. A brand that could turn someone's story into something timeless.
            </p>
            <p>
              From those humble beginnings, Jabour grew into an award-winning jewellery house in Brazil, known for integrity, craftsmanship, and emotion in every piece. And now, life has brought us full circle to London's prestigious Hatton Garden, where we continue to share our love, our art, and our journey with you.
            </p>
            <p className="text-xl font-normal text-primary-900 pt-4">
              For us, Jabour isn't just a brand. It's our love story, one we now have the honour of weaving into yours.
            </p>
          </div>
          <div className="mt-16 p-10 bg-white rounded-sm border-l-4 border-gold-500 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="text-6xl font-serif text-gold-500 italic leading-none mt-2">"</div>
              <p className="text-xl font-light text-gray-700 italic leading-relaxed flex-1">
                Our greatest wish is to bring the beauty of love into people's lives through jewellery — not just as something you wear, but as something that carries your heart. Every Jabour piece is a reflection of your story, your emotions, your love, exactly as it is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Craft & Promise */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-4 tracking-tight">
              Our Craft
              <br />
              <span className="font-light">& Promise</span>
            </h2>
          </div>
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
            <p>
              At Jabour, every piece begins with passion and precision. Each creation is handmade by our team of highly skilled artisans, whose expertise and dedication reflect the exceptional standards we believe our clients deserve.
            </p>
            <p>
              Our gemstones and diamonds are individually hand-selected by our specialised team, chosen for their beauty, brilliance, and quality. From the first sketch to the final polish, every detail is crafted with care, ensuring that each piece embodies the elegance, integrity, and emotion that define Jabour.
            </p>
            <p>
              Within our own workshop in the heart of Hatton Garden, our artisans bring each design to life with a level of artistry and refinement that meets our highest expectations — so that when you receive your piece, it is nothing short of perfection.
            </p>
            <p className="text-2xl font-normal text-primary-900 pt-6 border-t border-gray-200 mt-8">
              At Jabour, craftsmanship is not just a process — it is a promise.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible Diamond Sourcing */}
      <section className="section-padding bg-gray-50 py-24">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-8 tracking-tight">
                Responsible Diamond
                <br />
                <span className="font-light">Sourcing</span>
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
                <p>
                  At Jabour, integrity is at the heart of everything we create, and that begins with the origin of our stones. Every diamond and gemstone we use is ethically sourced from trusted, reputable suppliers who share our values of transparency and responsibility.
                </p>
                <p>
                  We are proud supporters of the Kimberley Process, an international initiative that has helped eliminate 99.8% of the global trade in conflict diamonds. Through this commitment, we ensure that every stone we select represents not only beauty, but also respect, for people, for communities, and for our planet.
                </p>
                <p>
                  In addition, we are continuously expanding our lab-grown diamond collection, offering clients an expert-curated selection of sustainable, high-quality alternatives that meet Jabour's exacting standards of brilliance and craftsmanship.
                </p>
                <p className="text-xl font-normal text-primary-900 pt-4">
                  Because to us, a truly beautiful diamond is one that shines with ethics, care, and conscience.
                </p>
              </div>
            </div>
            <div className="relative h-[600px] rounded-sm overflow-hidden shadow-xl">
              <Image
                src="/images/about/responsible.png"
                alt="Responsible Diamond Sourcing"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Packaging */}
      <section className="section-padding bg-white py-24">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] rounded-sm overflow-hidden shadow-xl order-2 md:order-1">
              <Image
                src="/images/about/our-packing-jabour.png"
                alt="Our Packaging"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 mb-8 tracking-tight">
                Our Packaging
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
                <p>
                  At Jabour, we believe that the experience of receiving your jewellery should be as meaningful as the piece itself. Every element of our packaging is designed with intention, love, and a touch of our heritage.
                </p>
                <p>
                  We embrace bright, vibrant colours and rich textures that reflect the warmth and spirit of our Brazilian roots, a reminder of where our story began. Each box is crafted to deliver not just a jewel, but a feeling: love, care, and connection.
                </p>
                <p>
                  Inside, your chosen piece rests safely and elegantly, accompanied by the official certificates of your gemstones or diamonds, presented in a beautifully designed envelope. From the moment you open your box, we want you to feel the same emotion, joy, and authenticity that go into every Jabour creation.
                </p>
                <p className="text-xl font-normal text-primary-900 pt-4">
                  Because at Jabour, every detail matters, from our hands to your heart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-b from-primary-900 to-primary-800 py-24 text-white">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-tight">
            Discover Our
            <br />
            <span className="font-normal">Craftsmanship</span>
          </h2>
          <p className="text-xl font-light text-primary-100 mb-12 max-w-2xl mx-auto italic">
            Experience the artistry and emotion behind every Jabour creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/engagement-rings" 
              className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider transition-colors min-w-[250px] text-center"
            >
              View Our Collection
            </Link>
            <Link 
              href="/book-appointment" 
              className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-sm font-light text-sm uppercase tracking-wider hover:bg-white/10 transition-colors min-w-[250px] text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}