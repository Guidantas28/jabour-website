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

const clarityGrades = [
  {
    id: 'fl',
    name: 'FL',
    title: 'Flawless',
    description: 'A completely blemish and inclusion free diamond. To enquire about a diamond of this clarity we recommend speaking to one of our Diamond Heaven Sales Executives.',
  },
  {
    id: 'if',
    name: 'IF',
    title: 'Internally Flawless',
    description: 'This clarity diamond is internally completely clean. A diamond of this quality is rare and breathtakingly beautiful.',
  },
  {
    id: 'vvs1',
    name: 'VVS1',
    title: 'Very Very Slightly Included',
    description: 'A diamond of this clarity will have barely visible inclusions under 10x magnification, meaning light will dance and sparkle across the facets of a diamond of this clarity.',
  },
  {
    id: 'vvs2',
    name: 'VVS2',
    title: 'Very Very Slightly Included',
    description: 'A diamond of this clarity will have barely visible inclusions under 10x magnification, meaning light will dance and sparkle across the facets of a diamond of this clarity.',
  },
  {
    id: 'vs1',
    name: 'VS1',
    title: 'Very Slightly Included',
    description: 'Inclusions in this clarity are minor and can be difficult for a gemologist to identify under 10x magnification. To the naked eye, a diamond of this clarity will appear clean.',
  },
  {
    id: 'vs2',
    name: 'VS2',
    title: 'Very Slightly Included',
    description: 'Inclusions in this clarity are minor and can be difficult for a gemologist to identify under 10x magnification. To the naked eye, a diamond of this clarity will appear clean.',
  },
  {
    id: 'si1',
    name: 'SI1',
    title: 'Slightly Included',
    description: 'A diamond of this clarity will still have visible inclusions under 10x magnification, however, may appear clear with the naked eye from a bird\'s eye view of the diamond. Again, each diamond is different. So, if possible, we recommend viewing a diamond of this clarity to ensure you are completely happy with the inclusion placement.',
  },
  {
    id: 'si2',
    name: 'SI2',
    title: 'Slightly Included',
    description: 'Inclusions will be noticeable, whether it be size or the amount, under a 10x magnification. To the naked eye however, inclusions may be positioned in a mount to make them less noticeable.',
  },
  {
    id: 'i1',
    name: 'I1',
    title: 'Included',
    description: 'A diamond of this clarity will have obvious inclusions under 10x magnification, as well as to the naked eye. A diamond of this quality will not be able to disperse light due to the magnitude of inclusions, therefore it is highly recommended to view a diamond of this quality before purchasing.',
  },
]

const cutGrades = [
  {
    id: 'ideal',
    name: 'IDEAL',
    title: 'Excellent & Very Good Cuts',
    description: 'A diamond with proportions optimized for maximum light performance. Light rays enter the top of the diamond, reflect internally off the pavilion facets at precise angles, and are efficiently refracted back out through the top towards the viewer. This demonstrates excellent light return, which translates to high brilliance, fire, and scintillation.',
  },
  {
    id: 'shallow',
    name: 'SHALLOW',
    title: 'Good Cuts',
    description: 'A diamond with a shallow pavilion. Light rays enter the top, but many escape through the sides of the pavilion, particularly from the bottom-side facets, rather than reflecting back to the viewer. This indicates moderate light return, with some sparkle but less concentrated brilliance than an ideal cut.',
  },
  {
    id: 'deep',
    name: 'DEEP',
    title: 'Fair Cuts',
    description: 'A diamond with a noticeably deep pavilion. Light rays enter the top of the diamond, but instead of reflecting back up through the top, many escape through the bottom and lower sides of the pavilion. This illustrates that a deep cut allows light to leak out, resulting in poor light return and reduced sparkle.',
  },
]

const certificateTypes = [
  {
    id: 'gia',
    name: 'GIA',
    fullName: 'Gemological Institute of America',
    description: 'Established in 1931, GIA is the world\'s foremost authority on diamonds. They revolutionised the grading of diamonds by creating the 4 C\'S (Colour, clarity, carat, cut) which all diamond graders follow as standard for evaluating, buying and selling diamonds to this day. Since January 2006, GIA laser inscribe many of their diamonds with the matching certificate number, giving customers that extra reassurance the diamond matches the grading on the certificate. A diamond loupe of x20 magnification or microscope is required to see the inscription on the girdle of the diamond, therefore not effecting the brilliance and quality of the gemstone.',
    website: 'https://www.gia.edu',
  },
  {
    id: 'igi',
    name: 'IGI',
    fullName: 'International Gemological Institute',
    description: 'Established in 1975, IGI is one of the oldest diamond laboratories in Antwerp. They are one of the largest grading laboratories in the world, with offices in Antwerp, New York, Honk Kong, Mumbai, Bangkok and many more. IGI diamonds are laser inscribed to ensure the diamond in question matches the grading certificate perfectly. IGI are also the leading certification for Lab Grown Diamonds, ensuring quality and peace of mind with each diamond.',
    website: 'https://www.igi.org',
  },
  {
    id: 'gie',
    name: 'GIE',
    fullName: 'Gemological Institute of Europe',
    description: 'GIE is one of the leading gemological laboratories providing independent diamond certification services.',
  },
  {
    id: 'idgl',
    name: 'IDGL',
    fullName: 'Independent Diamond Grading Laboratories',
    description: 'As well as our GIA/IGI/AGI Certification, we also offer a secondary diamond certification called IDGL. Instead of purchasing one certified diamond, we will purchase a pack of diamonds that usually contains 50-100 stones. We will then inspect each individual diamond and select the best stones from this pack to be sent to the IDGL laboratory to be independently certified. The main advantage of buying diamonds like this is the price point. By buying diamonds in a parcel, we can purchase at a set price, regardless if it is an SI1 or an SI2 clarity, or a D or G in colour.',
  },
]

const preciousMetals = [
  {
    id: 'platinum',
    name: 'PLATINUM',
    description: [
      'Platinum has become one of the most popular metals to be used in engagement rings and wedding rings. Platinum is a naturally white-coloured metal, meaning it will not tarnish and lose its brilliance. Platinum is also a very rare metal that is only mined in a few select areas of the world, making it a more expensive metal in comparison to Gold and Palladium.',
      'Platinum will also enhance the colour of a diamond and its natural sparkle.',
      'Platinum is usually hallmarked at \'950\', meaning it is 95% pure platinum with the remaining 5% usually being palladium, iridium ruthenium and other alloys. Platinum is also a great choice for those who have contact allergies, as the purity of the platinum reduces the likelihood of any irritation during wear.',
      'As with all metals, Platinum can scratch. However, with proper care, the wear should be minimal and can be polished again to return the metal to its original look.',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    description: [
      'Silver is one of the oldest precious metals used for making jewellery and is known for its bright white colour. Like gold, 100% silver is too soft for creating jewellery. All our silver jewellery uses a blend of 92.5% silver and 7.5% metal alloy. The alloy we use for our silver diamond rings is copper and zinc. However, silver can be prone to tarnishing as it oxidises and you may find it will have heavier scratching with daily wear as it is softer compared to other luxury metals. Ensuring your silver engagement ring is regularly cleaned and plated with rhodium is essential to restore it from scratching and tarnishing which will occur over time.',
    ],
  },
  {
    id: '18k-white-gold',
    name: '18k White Gold',
    description: [
      'White Gold is an incredibly popular choice of metal for engagement ring settings. White Gold has the same overall appearance as Platinum, however, it has been said to have a brighter \'white shine\' and is usually less expensive than Platinum.',
      'White gold is naturally an off-white colour, usually with a slight yellow tint. This is because pure gold is usually mixed with at least one white alloy such as palladium or magnesium.',
      'To give white gold the trademark brightness, it is plated with rhodium or iridium - this plating will wear over time and return to its natural yellow tinted colour. However, it can be polished and replated to return the metal to its former glory.',
    ],
  },
  {
    id: '18k-yellow-gold',
    name: '18k Yellow Gold',
    description: [
      'Yellow Gold is a classic and timeless metal choice for any engagement ring. For thousands of years yellow gold has been used in jewellery. It is known for its warmth in colour which suits many skin tones and its durability as it is resistant to erosion. The colour of the gold is determined by its mix of 75% pure gold and other alloys such as copper and zinc. It has always been a popular choice for modern dainty engagement ring styles to detailed vintage pieces, making it a great choice if you want a ring that can be passed down generations as a family heirloom.',
    ],
  },
  {
    id: '18k-rose-gold',
    name: '18k Rose Gold',
    description: [
      'Known for its bright pink hue, Rose Gold originally gained popularity in the 1920s and was loved for its vibrant copper pink gold colour. Rose gold then made a big comeback in 2010 with different lighter shades of this popular pink gold in various jewellery pieces. The unique blush tone of Rose Gold is primarily composed of gold mixed with copper and sometimes silver. As our gold engagement ring mounts are 18k gold, the composition will be 75% gold, with the remaining 25% being copper and sometimes silver to adjust the pink colour. A Rose Gold Engagement ring and Wedding ring give a romantic elegant set that not all metals can achieve.',
    ],
  },
  {
    id: '9k-white-gold',
    name: '9K WHITE GOLD',
    description: [
      'Like 9k rose gold, 9k white gold diamond jewellery contains less gold in the metal. 18k white gold contains 75% pure gold and 25% white metal alloys (silver and palladium), whilst 9k white gold consists of 37.5% pure gold and 62.5% white alloys. A 9k white gold ring is more affordable than an 18k one with less pure gold in the mix. It is the perfect choice for couples who want a cost-effective wedding band or engagement ring.',
    ],
  },
  {
    id: '9k-yellow-gold',
    name: '9k Yellow Gold',
    description: [
      'Typically, 9k yellow gold has a slightly paler colour than 18k yellow gold - this is due to the amount of pure gold in the metal. While 18k yellow gold has 75% pure gold and the remaining 25% is made up of other alloy metals, 9k yellow gold contains half the amount of pure gold in the metal at 37.5%. The other 62.5% of the metal consists of different alloys, such as silver, nickel, and copper. 9k yellow gold jewellery is an excellent option if you want an affordable yellow gold ring or pendant.',
    ],
  },
  {
    id: '9k-rose-gold',
    name: '9K ROSE GOLD',
    description: [
      'When browsing for your engagement ring, you may have found 9k and 18-karat gold options to select from. This refers to how much pure gold is in the alloy. While 18k rose gold has 75% pure gold and 25% alloy (copper & sometimes silver), 9k rose gold is made from 37.5% gold, 20% silver and 42.5% copper. The amount of copper in a 9k rose gold ring gives it a more reddish vibrant tone.',
    ],
  },
  {
    id: 'palladium',
    name: 'PALLADIUM',
    description: [
      'Palladium is a rare naturally white coloured precious metal and is part of the platinum group metals. This means that like platinum it is less resistant to scratching and it will not tarnish in colour like white gold, it also will not oxidise over time like silver, making it a great choice for jewellery. However palladium is a light weight metal and less dense than Platinum. Palladium also has its ups and downs in price variation as it is also a popular industrial metal and prices can fluctuate due to world events, supply troubles and changing demands between industries.',
      'Palladium is usually hallmarked at \'950\' meaning it is 95% pure palladium with the remaining 5% usually being ruthenium, (there can be traces of other metals) which adds hardness and durability to the metal making it a great choice for harder wearing jewellery.',
      'As with all metals, Palladium can scratch. However, with proper care, the wear should be fairly minimal and it can be polished again to return the metal to its original look.',
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
    description: 'Diamond clarity is the grading of the amount and size of imperfections in a diamond, commonly known as inclusions.',
  },
  'cut': {
    title: 'Diamond Cut',
    description: 'Not to be mistaken with shape, your diamond cut is an important characteristic to consider when purchasing a diamond. The cut will ultimately govern how well the light is refracted; giving the diamond it\'s sparkle.',
  },
  'certificates': {
    title: 'Certificates',
    description: 'At Jabour, we understand our customers require peace of mind when buying a beautiful piece of jewellery. We want customers to be confident that all diamonds sold by Jabour are the quality advertised. Therefore, all our jewellery comes with diamond certification as standard.',
  },
  'lab-grown-diamonds': {
    title: 'Lab Grown Diamonds',
    description: 'Lab Grown diamonds, also known as man-made diamonds, are identical to Natural diamonds in its chemical properties. The only difference is how the diamonds are created. Whilst Natural diamonds take millions of years to develop beneath the Earth\'s crust, Lab Grown Diamonds are created in highly controlled laboratory environments that imitate the conditions a natural diamond is created in a fraction of the time.',
  },
  'precious-metal': {
    title: 'Precious Metals',
    description: 'The metal you choose should suit not only your partner\'s style but also showcase the diamond. Yellow Gold is a traditional choice and warming to most skin tones.',
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
      <section className={`section-padding pb-24 ${params.topic === 'shape' || params.topic === 'carat' || params.topic === 'colour' || params.topic === 'clarity' || params.topic === 'cut' || params.topic === 'certificates' || params.topic === 'lab-grown-diamonds' || params.topic === 'precious-metal' ? 'bg-gray-50' : 'bg-white'}`}>
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
          ) : params.topic === 'clarity' ? (
            <div className="space-y-12">
              {/* Introduction Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    When diamonds are formed imperfections inside the diamond form and impurities become trapped inside the stone called carbon. Almost all diamonds contain small traces of carbon. Most inclusions are not visible to the naked eye and require at least a 10x magnification to identify the imperfections.
                  </p>
                </div>
              </div>

              {/* Clarity Grades Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {clarityGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all hover:border-gold-500"
                  >
                    <div className="p-8">
                      <div className="mb-4">
                        <h3 className="text-3xl font-serif font-normal text-primary-900 mb-2">
                          {grade.name}
                        </h3>
                        <p className="text-sm font-light text-gray-600 uppercase tracking-wide">
                          {grade.title}
                        </p>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-light text-sm">
                        {grade.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : params.topic === 'cut' ? (
            <div className="space-y-12">
              {/* Introduction Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    If you purchase a badly cut diamond then it will not refract the light as well and will not sparkle. Poorly cut diamonds will also give you a smaller spread for your selected carat weight.
                  </p>
                  <p>
                    Cut grades were developed by the GIA (Gemological Institute of America) during the 1940's and 1950's to enable independent labs to not only evaluate clarity and colour, but to check the structure of the diamond itself. For example, a round brilliant cut diamond will have 57 or 58 facets, which are precisely cut and defined.
                  </p>
                  <p>
                    While these are miniature in size, they are extremely important as they govern how well the diamond is going to sparkle.
                  </p>
                  <p>
                    It is important to ensure you select a well-cut diamond so that you get a good sparkle. You may be able to save a lot of money on poorer cut diamonds, but ultimately you will pay with a diamond that does not sparkle and lacks lustre.
                  </p>
                </div>
              </div>

              {/* Diamond Cut Chart Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-8 text-center">
                  Diamond Cut Chart
                </h2>
                <p className="text-gray-700 leading-relaxed font-light text-lg text-center mb-12 max-w-3xl mx-auto">
                  Every diamond is graded on its cut quality and is given a grade, ranging from excellent to poor. The higher the cut grade, the better the fire and shine that is emitted from the diamond. Take a look at our diamond cut chart to understand each grade.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  {cutGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="bg-gray-50 border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all hover:border-gold-500"
                    >
                      <div className="p-8">
                        <div className="mb-6">
                          <h3 className="text-3xl font-serif font-normal text-primary-900 mb-3">
                            {grade.name}
                          </h3>
                          <p className="text-sm font-light text-gray-600 uppercase tracking-wide mb-2">
                            {grade.title}
                          </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-light text-sm">
                          {grade.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : params.topic === 'certificates' ? (
            <div className="space-y-12">
              {/* Introduction Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <div className="space-y-8 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-serif font-normal text-primary-900 mb-4">
                      What is a Diamond Certificate?
                    </h2>
                    <p>
                      A Diamond certificate is a report created by a team of gemologist to evaluate the quality of a diamond. They are also known as a Diamond Grading Report, a Diamond Dossier, and a Diamond Quality document. It is an impartial documentation from a highly trained team of gemologists, giving an impartial assessment on each diamond. During the grading process, the 4 C's (colour, clarity, carat, cut) are strictly assessed using jeweller's loupes, microscopes, and other industry standard tools.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-serif font-normal text-primary-900 mb-4">
                      Why is Diamond Certificate important?
                    </h2>
                    <p>
                      A diamond certification is your proof of purchase for your chosen gem. Like a snowflake, no two diamonds are the same, so this should be recognised by the diamond grading laboratories. A diamond certificate is also required to ensure your jewellery is insured for the correct value with your home insurance. If a diamond is purchased without certification, it will not only be hard to insure the item but there will also be no way of proving the quality of the diamond. A diamond certificate is your peace of mind during the final stages of the purchasing process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Types of Diamond Certification Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-8 text-center">
                  Types of Diamond Certification
                </h2>
                <p className="text-gray-700 leading-relaxed font-light text-lg text-center mb-12 max-w-3xl mx-auto">
                  Our diamonds are certified by the world's leading gemological laboratories. We offer our customers the following certifications:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {certificateTypes.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-gray-50 border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all hover:border-gold-500 p-8"
                    >
                      <div className="mb-4">
                        <h3 className="text-2xl font-serif font-normal text-primary-900 mb-2">
                          {cert.name}
                        </h3>
                        <p className="text-sm font-light text-gray-600 uppercase tracking-wide mb-4">
                          {cert.fullName}
                        </p>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-light text-sm mb-4">
                        {cert.description}
                      </p>
                      {cert.website && (
                        <a
                          href={cert.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-900 hover:text-gold-500 text-sm font-light underline"
                        >
                          Visit their website →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* What's the Difference Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6 text-center">
                  What's the Difference?
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    The most trusted and well-known diamond laboratories globally are:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Gemological Institute of America (GIA)</li>
                    <li>International Gemological Institute (IGI)</li>
                    <li>Hoge Raad voor Diamant (HRD)</li>
                    <li>European Gemological Laboratory (EGL USA)</li>
                    <li>GIE (Gemological Institute of Europe)</li>
                  </ul>
                  <p className="font-normal text-primary-900">
                    Out of the five mentioned organisations, the three we recommend at Jabour are:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 font-normal text-primary-900">
                    <li>GIA</li>
                    <li>IGI</li>
                    <li>GIE</li>
                  </ul>
                  <p>
                    Each of these diamond laboratories have their own format of grading, whether this is seen in the layout of the certification, or the tools used to grade the diamonds. As each diamond laboratory has its own grading system, it is common for there to be a difference when comparing to each other. There can sometimes be a difference in a colour and clarity grading, but again this is rare.
                  </p>
                  <p>
                    The main thing to remember when choosing a diamond is quite simple; do you love it? Will you wake up every day and still lose your breath every time you look down at your engagement ring? Will you still love it in 10 years time? At Jabour, our goal is to ensure you are 100% satisfied with the diamond you purchase.
                  </p>
                </div>
              </div>

              {/* Uncertified Diamond Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-6 text-center">
                  Should I Purchase an Uncertified Diamond?
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    At Jabour, we do not recommend purchasing an uncertified diamond from 0.30ct and over.
                  </p>
                  <p>
                    For diamonds under 0.30ct, then a jewellery appraisal or jewellery valuation should be given with the diamond jewellery to be covered for replacement costs under your insurance.
                  </p>
                </div>
              </div>
            </div>
          ) : params.topic === 'lab-grown-diamonds' ? (
            <div className="space-y-12">
              {/* How are Lab Grown Diamonds Made Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-8 text-center">
                  How are Lab Grown Diamonds Made?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif font-normal text-primary-900 mb-4">
                      HPHT (High Pressure High Temperature)
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-light text-lg">
                      The traditional HPHT method mimics the extreme heat and pressure conditions deep within the Earth's crust that creates natural diamonds. A diamond seed is placed into a piece of pure carbon, where scientist can then impose high temperatures and pressures in a controlled environment, mimicking the same process a natural diamond undertakes to grow.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif font-normal text-primary-900 mb-4">
                      CVD (Chemical Vapour Disposition)
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-light text-lg">
                      CVD is a fairly modern technology to produce Lab Grown diamonds but has proven to be highly successful. CVD diamond growth takes place within a vacuum chamber. A diamond seed from a natural diamond is placed within the chamber, which is then filled with hydrogen and carbon containing gas, such as methane. A source of energy - in this case, a microwave beam- breaks down the gas molecules and the carbon atoms then attach to the diamond seed. The diamond seed will need to be polished throughout the process, as rough edges of black graphite can appear. This is a quick process that does not diminish the quality of the diamond, which will be ready within a matter of weeks.
                    </p>
                  </div>
                </div>
              </div>

              {/* What is the difference Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-8 text-center">
                  What is the Difference Between Lab & Natural Diamonds?
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    There are barely any visible differences when comparing a Lab Grown Diamond to a natural Diamond.
                  </p>
                  <p>
                    Lab Grown Diamonds have the same light performance as a natural diamond, the same durability, the same hardness and most importantly, can be certified by established diamond grading labs such as GIA and IGI.
                  </p>
                  <p>
                    The only way to tell a difference between the two diamonds is with using specialised equipment to identify the different crystal growths.
                  </p>
                </div>
              </div>

              {/* Are Lab Grown Diamonds Certified Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-8 text-center">
                  Are Lab Grown Diamonds Certified?
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    At Jabour, all our Lab Grown Diamonds come with certification.
                  </p>
                  <p>
                    The process of diamond grading is the same for a Lab Grown diamond as it is for a Natural Diamond. The grading process focuses on the 4 C'S, cut, clarity, colour, and carat. Each step of the grading process is taken very seriously to ensure all diamonds are given the correct grade. The certificate will then state if any further heat treatment has been used on the diamond and whether it is a HPHT diamond or CVD diamond.
                  </p>
                  <p>
                    At Jabour, we sell GIA and IGI certified Lab Grown Diamonds. However, please note GIA certificates are online documentation only. This can be downloaded for your personal records. IGI Lab Grown Diamonds will come with a physical certificate.
                  </p>
                </div>
              </div>

              {/* Are Lab Grown Diamonds Ethical Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <h2 className="text-3xl font-serif font-normal text-primary-900 mb-8 text-center">
                  Are Lab Grown Diamonds Ethical?
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    As a whole Lab Grown diamonds are seen as a more ethical choice for your engagement ring. There is no damage to the environment as they do not require mining to produce.
                  </p>
                  <p>
                    The working conditions for Lab Grown diamonds are far more ethical, as we can be entirely sure where the diamond has come from and be sure of the human rights and working conditions for the individual involved.
                  </p>
                  <p>
                    Lab Grown diamonds still use a considerable amount of energy, however this is much lower than mining a Natural Diamond.
                  </p>
                  <p>
                    In recent years, diamond mines have made critical changes to become more ethically conscious. All legitimate diamond mine companies abide to the Kimberley Process, ensuring the legitimacy of diamonds purchased and to ensure they have not been used to profit in conflict.
                  </p>
                </div>
              </div>

              {/* Price and Investment Section */}
              <div className="bg-white rounded-sm border border-gray-200 p-12">
                <div className="space-y-6 text-gray-700 leading-relaxed font-light text-lg max-w-4xl mx-auto">
                  <p>
                    The most significant difference between Lab Grown Diamonds and Natural Diamonds is the price. You will find that a Lab Grown Diamond can be 40-50% cheaper than a Natural Diamond, meaning you can spend less money on higher specifications in a Lab Grown Diamond than that of a Natural Diamond.
                  </p>
                  <p>
                    If you are looking for a diamond as an investment, then we would recommend a Natural Diamond. All the diamonds that will ever exist have already been created in the Earth's crust. Once the mines are empty, there will be no more diamonds left to mine. The natural beauty and quality of a natural diamond also make it a rare and valuable gemstone.
                  </p>
                </div>
              </div>
            </div>
          ) : params.topic === 'precious-metal' ? (
            <div className="space-y-12">
              {/* Precious Metals Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {preciousMetals.map((metal) => (
                  <div
                    key={metal.id}
                    className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all hover:border-gold-500"
                  >
                    <div className="p-8">
                      <div className="mb-6">
                        <h3 className="text-2xl font-serif font-normal text-primary-900 mb-4">
                          {metal.name}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {metal.description.map((paragraph, idx) => (
                          <p key={idx} className="text-gray-700 leading-relaxed font-light text-sm">
                            {paragraph}
                          </p>
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
