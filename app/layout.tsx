import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSeoSettings } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings();

  return {
    metadataBase: new URL('https://animekompi.fun'),
    title: {
      default: 'AnimeKompi - Nonton Anime Subtitle Indonesia Gratis',
      template: '%s | AnimeKompi'
    },
    description: settings?.metaDescription || 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis. Streaming anime ongoing, completed, dan batch download dengan kualitas HD.',
    keywords: settings?.metaKeywords.split(',').map(k => k.trim()) || [
      'anime',
      'nonton anime',
      'anime subtitle indonesia',
    ],
    authors: [{ name: 'AnimeKompi' }],
    creator: 'AnimeKompi',
    publisher: 'AnimeKompi',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: 'https://animekompi.fun',
      siteName: 'AnimeKompi',
      title: 'AnimeKompi - Nonton Anime Subtitle Indonesia Gratis',
      description: settings?.metaDescription || 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis.',
      images: [
        {
          url: settings?.ogImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'AnimeKompi - Nonton Anime Sub Indo',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AnimeKompi - Nonton Anime Subtitle Indonesia Gratis',
      description: settings?.metaDescription || 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis.',
      images: [settings?.ogImage || '/og-image.jpg'],
      creator: settings?.twitterHandle || '@animekompi',
    },
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
    verification: {
      google: settings?.googleVerification || undefined,
      other: {
        'msvalidate.01': settings?.bingVerification || '',
        'yandex-verification': settings?.yandexVerification || '',
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://animekompi.fun" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-950 text-white antialiased`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
