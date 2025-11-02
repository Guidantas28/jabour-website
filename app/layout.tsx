import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Jabour Jewellery - Bespoke Luxury Jewellery',
  description: 'Discover exquisite bespoke jewellery crafted with precision and care. Engagement rings, wedding rings, and fine jewellery collections.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${playfair.variable}`} style={{ margin: 0, padding: 0, width: '100%' }}>
      <body className="antialiased" style={{ margin: 0, padding: 0, width: '100%' }}>
        <Header />
        <main className="min-h-screen" style={{ width: '100%' }}>{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  )
}
