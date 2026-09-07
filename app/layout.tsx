import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Navbar } from '@/components/navbar/navbar';
import { Footer } from '@/components/footer/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Kashi Yatra — AI-Powered Varanasi Trip Planner',
    template: '%s | Kashi Yatra',
  },
  description:
    'Plan your perfect Varanasi trip with AI. Personalized itineraries, hotel recommendations, cost estimates, and local expertise for the spiritual capital of India.',
  keywords: [
    'Varanasi travel',
    'Varanasi trip planner',
    'Varanasi itinerary',
    'Varanasi tour',
    'Places to visit in Varanasi',
    'Varanasi travel guide',
    'Kashi Yatra',
  ],
  openGraph: {
    title: 'Kashi Yatra — AI-Powered Varanasi Trip Planner',
    description:
      'Plan your perfect Varanasi trip with AI. Personalized itineraries, hotel recommendations, and cost estimates.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kashi Yatra — AI-Powered Varanasi Trip Planner',
    description:
      'Plan your perfect Varanasi trip with AI. Personalized itineraries, hotel recommendations, and cost estimates.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
