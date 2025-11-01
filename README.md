# Jabour Jewellery

A modern ecommerce website for Jabour Jewellery, inspired by Queensmith's elegant design and user experience.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Product Catalog**: Engagement rings, wedding rings, diamonds, and jewellery
- **Product Pages**: Detailed product pages with metal and diamond shape selection
- **Appointment Booking**: In-store and virtual appointment booking system
- **Contact Forms**: Easy communication with customers
- **Modern Stack**: Next.js 14, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
site-jabour/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── engagement-rings/  # Engagement rings pages
│   ├── wedding-rings/     # Wedding rings pages
│   ├── diamonds/          # Diamonds pages
│   ├── jewellery/         # Jewellery pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── book-appointment/  # Appointment booking
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   └── Footer.tsx        # Footer
└── public/               # Static assets
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Playfair Display**: Serif font for headings
- **Inter**: Sans-serif font for body text

## Customization

- Update colors in `tailwind.config.js`
- Modify product data in respective page files
- Add images to `/public` directory
- Customize fonts and styling as needed

## License

Private - Jabour Jewellery
