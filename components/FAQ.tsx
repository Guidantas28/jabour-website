'use client'

import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Why Jabour & Co ?',
    answer: 'Jabour Jewellery blends award-winning craftsmanship with exceptional customer care. With a five-star reputation and decades of design excellence in Rio de Janeiro, Brazil, Jabour now joins London\'s Hatton Garden to bring a fresh perspective and a new level of artistry to fine jewellery. Renowned for our attention to detail and ability to bring each client\'s vision to life, we create bespoke engagement rings, wedding bands, and fine jewellery that reflect true individuality. Every piece is handcrafted to perfection, combining traditional techniques with contemporary design for a result that\'s as personal as it is timeless. From your first consultation, our dedicated team will guide you through every step, with no rush, no pressure, just genuine expertise and care. At Jabour, we\'re passionate about turning ideas into beautifully crafted realities, ensuring your experience is as meaningful as the jewellery itself. Discover why Jabour Jewellery is redefining bespoke craftsmanship in Hatton Garden, where artistry, authenticity, and personal service meet.',
  },
  {
    question: 'How long does it take to make a bespoke ring?',
    answer: 'The timeline can vary depending on the complexity of the design, but most bespoke pieces are completed within 4 to 6 weeks. During your consultation, we\'ll provide a clear timeframe so you know exactly what to expect. If you have a specific date in mind, such as a proposal or wedding, we\'ll always do our best to accommodate your schedule.',
  },
  {
    question: 'Are your diamonds ethically sourced?',
    answer: 'Yes. We take responsibility for every material we use. Jabour & Co offers both ethically sourced natural diamonds and certified lab-grown diamonds, allowing you to choose what aligns best with your values. All our natural diamonds are sourced through the Kimberley Process Certification Scheme, ensuring they are conflict-free and responsibly mined. We work exclusively with trusted suppliers who adhere to strict ethical and environmental standards, so you can wear your piece with complete confidence.',
  },
  {
    question: 'Can I use my own diamond or gemstone in a design?',
    answer: 'Yes, we\'re happy to work with your own diamond or gemstone. Whether it\'s an heirloom stone or a personal purchase, our experts will inspect it for quality and suitability, then design a setting that complements it perfectly. We take every precaution to ensure your stone is handled with the utmost care and respect throughout the process.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-white py-24">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-primary-900 mb-4 tracking-tight">
            Frequently Asked
            <br />
            <span className="font-normal">Questions</span>
          </h2>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mt-6"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
              >
                <h3 className="text-xl font-serif font-normal text-primary-900 pr-8 group-hover:text-gold-500 transition-colors">
                  {faq.question}
                </h3>
                <FaChevronDown
                  className={`text-gold-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[1000px]' : 'max-h-0'
                }`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-700 leading-relaxed font-light text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
