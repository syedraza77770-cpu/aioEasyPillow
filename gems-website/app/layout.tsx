import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/* ─── Metadata ──────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Indian Natural Gems and Jewellery | Certified Natural Gemstones Bangalore',
  description:
    '51-year-old family gemstone business in Bangalore. Certified natural astrological gemstones, rudraksha, and precious stones by GII-recognized gemologist Tausif Raza.',
  keywords: [
    'Bangalore gemstone dealer',
    'certified natural gemstones India',
    'astrological gemstones',
    'natural ruby emerald sapphire',
    'rudraksha beads Bangalore',
    'natural gemstones Bangalore',
    'gemstone jewellery India',
    'precious stones Bangalore',
    'neelam stone Bangalore',
    'manik stone Bangalore',
    'panna stone India',
    'yellow sapphire pukhraj',
    'blue sapphire neelam certified',
    'GII certified gemstones',
    'natural gemstone dealer Karnataka',
    'astrological gemstone consultant Bangalore',
    'rudraksha mala original',
    'navratna jewellery India',
    'M.G. Road jewellery Bangalore',
  ],
  authors: [{ name: 'Tausif Raza', url: 'https://indiannaturalgems.com' }],
  creator: 'Indian Natural Gems and Jewellery',
  publisher: 'Indian Natural Gems and Jewellery',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Indian Natural Gems and Jewellery',
    title: 'Indian Natural Gems and Jewellery | Certified Natural Gemstones Bangalore',
    description:
      '51-year-old family gemstone business in Bangalore. Certified natural astrological gemstones, rudraksha, and precious stones by GII-recognized gemologist Tausif Raza.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Natural Gems and Jewellery | Certified Natural Gemstones Bangalore',
    description:
      'Certified natural astrological gemstones from a 51-year-old family business in Bangalore.',
  },
  alternates: {
    canonical: 'https://indiannaturalgems.com',
  },
};

/* ─── Structured Data — Local Business JSON-LD ──────────────────────────── */
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://indiannaturalgems.com/#business',
  name: 'Indian Natural Gems and Jewellery',
  description:
    '51-year-old family gemstone business offering certified natural astrological gemstones, rudraksha beads, and precious stones in Bangalore.',
  url: 'https://indiannaturalgems.com',
  telephone: '+91-80-XXXX-XXXX',
  email: 'info@indiannaturalgems.com',
  foundingDate: '1973',
  priceRange: '₹₹–₹₹₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'M.G. Road',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    postalCode: '560001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9757,
    longitude: 77.6095,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:30',
    },
  ],
  image: 'https://indiannaturalgems.com/og-image.jpg',
  sameAs: [
    'https://www.facebook.com/indiannaturalgems',
    'https://www.instagram.com/indiannaturalgems',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Natural Gemstones & Jewellery',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Natural Ruby (Manik)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Natural Emerald (Panna)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Blue Sapphire (Neelam)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Yellow Sapphire (Pukhraj)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Natural Diamond' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Natural Pearl (Moti)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Red Coral (Moonga)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Hessonite (Gomed)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: "Cat's Eye (Lehsunia)" } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Rudraksha Beads' } },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '350',
    bestRating: '5',
  },
};

/* ─── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Preconnect for Google Fonts performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon placeholders */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* Theme colour for mobile browsers */}
        <meta name="theme-color" content="#c9983a" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <CartProvider>
          <SearchProvider>
            <Navbar />
            {children}
            <Footer />
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
