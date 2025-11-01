import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface TopicPageProps {
  params: {
    topic: string
  }
}

const diamondShapes = [
  {
    id: 'round',
    name: 'ROUND',
    description: 'The most popular choice of diamond, it has the most ideal proportions to maximise brilliance and sparkle.',
    image: '/images/education/shapes/round.jpg',
  },
  {
    id: 'princess',
    name: 'PRINCESS',
    description: 'The Princess Cut Diamond is an elegant, modern and popular diamond shape.',
    image: '/images/education/shapes/princess.jpg',
  },
  {
    id: 'emerald',
    name: 'EMERALD',
    description: 'Echoing back to old-Hollywood, the rectangular facets truly show off the diamond\'s clarity.',
    image: '/images/education/shapes/emerald.jpg',
  },
  {
    id: 'pear',
    name: 'PEAR',
    description: 'This is a great diamond to choose to elongate the finger whilst the light dances across this delicate and feminine diamond cut.',
    image: '/images/education/shapes/pear.jpg',
  },
  {
    id: 'oval',
    name: 'OVAL',
    description: 'The Oval Cut Diamond elongates the finger without losing its brilliance. A versatile and magnificent diamond choice!',
    image: '/images/education/shapes/oval.jpg',
  },
  {
    id: 'marquise',
    name: 'MARQUISE',
    description: 'If you\'re looking for a diamond shape to optimise the carat weight, then the Marquise Cut is your diamond of choice.',
    image: '/images/education/shapes/marquise.jpg',
  },
  {
    id: 'asscher',
    name: 'ASSCHER',
    description: 'An exceptional diamond cut, reminiscent of the Art-Deco era.',
    image: '/images/education/shapes/asscher.jpg',
  },
  {
    id: 'radiant',
    name: 'RADIANT',
    description: 'Encapsulating the best aspects of the Brilliant Cut, Emerald Cut and Princess Cut Diamond, the Radiant Cut Diamond has become a diamond in demand.',
    image: '/images/education/shapes/radiant.jpg',
  },
  {
    id: 'cushion',
    name: 'CUSHION',
    description: 'This soft \'pillow shape\' diamond is a unique cut, allowing for a greater separation of white light into spectral colours.',
    image: '/images/education/shapes/cushion.jpg',
  },
  {
    id: 'heart',
    name: 'HEART',
    description: 'A truly romantic diamond, what better way to show your love than with a Heart Cut Diamond?',
    image: '/images/education/shapes/heart.jpg',
  },
]

const caratData = [
  { shape: 'Round', icon: 'round', sizes: ['4mm', '5mm', '5.50mm', '6.50mm', '7.50mm', '8mm', '9.40mm', '10.40mm', '11.20mm'] },
  { shape: 'Princess', icon: 'princess', sizes: ['3.50mm', '4.50mm', '5mm', '5.50mm', '6.80mm', '7.50mm', '8mm', '8.90mm', '9.70mm'] },
  { shape: 'Heart', icon: 'heart', sizes: ['4x4mm', '5x5mm', '6x6mm', '6.50x6.50mm', '7x7mm', '8x8mm', '9x9mm', '10x10mm', '11x11mm'] },
  { shape: 'Emerald', icon: 'emerald', sizes: ['4x3mm', '6x4mm', '6.50x4.50mm', '7x5mm', '8x6mm', '8.50x6.50mm', '10x8mm', '11x9mm', '10x10mm'] },
  { shape: 'Asscher', icon: 'asscher', sizes: ['3.70mm', '4.40mm', '5mm', '5.80mm', '6.40mm', '7mm', '8.10mm', '9mm', '9.60mm'] },
  { shape: 'Marquise', icon: 'marquise', sizes: ['5x3mm', '8x4mm', '9x4.50mm', '10x4.75mm', '11x5mm', '12x6mm', '14x7mm', '15x7mm', '16x8mm'] },
  { shape: 'Radiant', icon: 'radiant', sizes: ['3.50x3mm', '5x4.50mm', '5.50x5mm', '6x5.50mm', '7x6mm', '7.50x7mm', '8.50x7.50mm', '9.50x8.50mm', '10x9mm'] },
  { shape: 'Cushion', icon: 'cushion', sizes: ['4x3.50mm', '5x4.50mm', '6x5mm', '6.50x5.50mm', '7.50x6.50mm', '8x7mm', '9x8mm', '10x8.50mm', '10x9.50mm'] },
  { shape: 'Oval', icon: 'oval', sizes: ['5x3mm', '6x4mm', '7x5mm', '7.50x5.50mm', '8.50x6.50mm', '9x7mm', '10x8mm', '11x9mm', '12x10mm'] },
  { shape: 'Pear', icon: 'pear', sizes: ['4x2mm', '6x4mm', '7x5mm', '8x5mm', '9x6mm', '10x7mm', '12x8mm', '14x9mm', '15x10mm'] },
]

const caratWeights = ['0.25ct', '0.50ct', '0.75ct', '1ct', '1.50ct', '2ct', '3ct', '4ct', '5ct']

const colourGrades = [
  {
    id: 'colourless',
    name: 'Colourless Diamond (D-F)',
    range: 'D-F',
    image: '/images/education/colour/colourless.jpg',
    description: [
      'A Diamond in the colourless range, especially D-E, are considering the rarest diamonds as they display no colour at all.',
      'An F colour diamond will have the smallest undetectable colour; only really seen when the diamond is face down and usually only by a trained Gemologist.',
      'A colourless diamond will come at a premium price; however it is worth considering each diamond in the colourless grade as an F Colour Diamond can be 20% cheaper and still have a stunning white sparkle like a D and E colour diamond.',
    ],
  },
  {
    id: 'near-colourless',
    name: 'Near Colourless Diamond (G-J)',
    range: 'G-J',
    image: '/images/education/colour/near-colourless.jpg',
    description: [
      'A diamond in the near-colourless range will still appear colourless when set into a diamond engagement ring.',
      'The colour will only be visible when viewed face down and compared directly to a diamond of a higher colour.',
      'These diamonds are fantastic in price, so a definite contender when choosing between the colour of each diamond.',
    ],
  },
  {
    id: 'faint-yellow',
    name: 'Faint Yellow - Light Yellow (K-Z)',
    range: 'K-Z',
    image: '/images/education/colour/faint-yellow.jpg',
    description: [
      'The diamonds in this grading will have a noticeable yellow tint to the diamond. Not to be confused with a Fancy Yellow Diamond, these diamonds will have more noticeable traces of nitrogen in the diamond, giving it the yellow tint.',
      'At Jabour & Co, we advise between a D-I Colour to ensure you can have the whitest diamond to your budget. However, should you prefer to choose a diamond with a lower colour then our Sales Team at Jabour & Co will be happy to source a Diamond for you.',
    ],
  },
]

const topics: Record<string, {
  title: string
  description: string
  content?: string
  image?: string
}> = {
  'shape': {
    title: 'Diamond Shapes',
    description: 'Choosing the right diamond shape for your partner can feel like a hard decision, but usually your gut instincts will lead you to the perfect shape.',
  },
  'carat': {
    title: 'Carat',
    description: 'Understanding carat weight and its impact on diamond size and value.',
  },
  'colour': {
    title: 'Colour',
    description: 'When searching for your perfect diamond, one of the C\'s to consider during this process is the Colour. Usually, people tend to choose a diamond with the least amount of colour, as it shows the purity of colour and rarity of quality.',
  },
  'clarity': {
    title: 'Diamond Clarity',
    description: 'Understanding clarity grades and how they affect your diamond\'s appearance.',
  },
  'cut': {
    title: 'Diamond Cut',
    description: 'The importance of cut quality and how it affects brilliance and sparkle.',
  },
  'certificates': {
    title: 'Certificates',
    description: 'Learn about diamond certificates and why they matter.',
  },
  'lab-grown-diamonds': {
    title: 'Lab Grown Diamonds',
    description: 'Everything you need to know about lab grown diamonds.',
  },
  'precious-metal': {
    title: 'Precious Metal',
    description: 'Understanding different precious metals for your engagement ring.',
  },
}

export default function TopicPage({ params }: TopicPageProps) {
  const topic = topics[params.topic]

  if (!topic) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="container-custom max-w-5xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-800">Home</Link>
            {' / '}
            <Link href="/education" className="hover:text-primary-800">Education</Link>
            {' / '}
            <span className="text-gray-900">{topic.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-white pt-20 pb-16">
        <div className="container-custom max-w-5xl mx-auto">
          <Link
            href="/education"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-800 mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Education
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-primary-900 mb-6 tracking-tight">
            {topic.title}
          </h1>
          <p className="text-xl font-light text-gray-700 leading-relaxed">
            {topic.description}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={`section-padding pb-24 ${params.topic === 'shape' || params.topic === 'carat' || params.topic === 'colour' ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="container-custom max-w-7xl mx-auto">
          {params.topic === 'shape' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {diamondShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="bg-white rounded-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:border-gold-500"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <Image
                      src={shape.image}
                      alt={shape.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-normal text-primary-900 mb-3">
                      {shape.name}
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-light text-sm">
                      {shape.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : params.topic === 'carat' ? (
            <div className="space-y-12">
              {/* What is Carat Section */}
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
                    What is Carat?
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
                    <p>
                      Carat refers to the weight of a diamond. Diamonds are all weighed in metric carats rather than grams or ounces. This is a standard industry practice around the world.
                    </p>
                    <p>
                      Diamond is expressed to the hundredth of a carat. Carat weight of less than a carat is expressed in points. So, for example, a 0.75ct diamond will be 75 points. Most jewellers will refer to carat weight in this terminology.
                    </p>
                    <p>
                      Another way to explain this would be using pounds, 100 pence equals 1 whole pound. Therefore 50pts will be 0.50ct and so on.
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6">
                    How to Work Out Carat Weight?
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
                    <p>
                      A common misconception is that it refers to the physical size of a diamond, which is incorrect. The diamond weight does not govern the size of stone.
                    </p>
                    <p>
                      We always recommend trying a range of carat weight on to determine which will be best for you. This way you will also be able to assess the visible size. For those who can't come into our store to view diamonds we have the chart below to give you an indication on size.
                    </p>
                  </div>
                </div>
              </div>

              {/* Carat Size Chart */}
              <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300 bg-gray-50">
                        <th className="p-4 text-left font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">Carat Weight</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">0.25ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">0.50ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">0.75ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">1ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">1.50ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">2ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">3ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">4ct</th>
                        <th className="p-4 text-center font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">5ct</th>
                        <th className="p-4 text-left font-serif font-normal text-primary-900 text-sm uppercase tracking-wide">Carat Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {caratData.map((item, idx) => (
                        <tr key={item.shape} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="p-4 font-serif font-normal text-primary-900">{item.shape}</td>
                          {item.sizes.map((size, sizeIdx) => (
                            <td key={sizeIdx} className="p-4 text-center text-gray-700 font-light text-sm">
                              {size}
                            </td>
                          ))}
                          <td className="p-4 font-serif font-normal text-primary-900">{item.shape}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : params.topic === 'colour' ? (
            <div className="space-y-12">
              {/* Introduction Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    The diamond colour grading system is based on an alphabetised system, starting from 'D', meaning the diamond is completely free of any colour, all the way to 'Z', meaning there is a visible tint of colour in the diamond.
                  </p>
                  <p>
                    To see a difference in colour between two diamonds, you usually have to compare at least three colour grades (i.e, E Colour and a H Colour).
                  </p>
                  <p className="font-normal text-primary-900">
                    The diamond colour system is categorised into the following grades:
                  </p>
                </div>
              </div>

              {/* Colour Grades Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {colourGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className="bg-primary-900 text-white rounded-sm overflow-hidden"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                      <Image
                        src={grade.image}
                        alt={grade.name}
                        fill
                        className="object-cover opacity-90"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-serif font-normal mb-4 text-white">
                        {grade.name}
                      </h3>
                      <div className="space-y-3 text-gray-200 leading-relaxed font-light text-sm">
                        {grade.description.map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-sm border border-gray-200 p-12">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg font-light space-y-6">
                  <p className="text-2xl font-light text-primary-900 italic mb-8">
                    Content for {topic.title} will be added here.
                  </p>
                  <p>
                    This section is ready for your specific content about {topic.title.toLowerCase()}. 
                    Once you provide the content, we'll update this section accordingly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation to other topics */}
      <section className="section-padding bg-gray-50 py-16">
        <div className="container-custom max-w-7xl mx-auto">
          <h2 className="text-2xl font-serif font-light text-primary-900 mb-8 text-center">
            Explore Other Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(topics).filter(([id]) => id !== params.topic).slice(0, 4).map(([id, t]) => (
              <Link
                key={id}
                href={`/education/${id}`}
                className="text-center p-4 bg-white border border-gray-200 rounded-sm hover:border-gold-500 hover:shadow-md transition-all"
              >
                <p className="font-serif font-normal text-primary-900 hover:text-gold-500 transition-colors">
                  {t.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
