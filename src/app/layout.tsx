import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrokerageCompass - Navigate Your Real Estate Career",
  description: "Professional brokerage comparison tool built by an agent, for agents. Compare commission splits, fees, revenue share, and stock awards across cloud and traditional brokerages.",
  keywords: "real estate brokerage comparison, commission calculator, agent tools, real estate career, Real Brokerage, eXp Realty, Epique Realty, LPT Realty",
  authors: [{ name: "Nick Bellante", url: "https://brokeragecompass.com" }],
  creator: "Nick Bellante",
  publisher: "BrokerageCompass",
  applicationName: "BrokerageCompass",
  
  // Comprehensive favicon and icon configuration
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' }
    ]
  },

  // Web App Manifest
  manifest: '/site.webmanifest',
  
  // Theme colors
  themeColor: '#475569',
  colorScheme: 'light',
  
  // Open Graph
  openGraph: {
    title: "BrokerageCompass - Navigate Your Real Estate Career",
    description: "Professional brokerage comparison tool built by an agent, for agents. See exactly how much you could earn at different brokerages.",
    url: "https://brokeragecompass.com",
    type: "website",
    siteName: "BrokerageCompass",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrokerageCompass - Professional Real Estate Brokerage Comparison Tool"
      }
    ]
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "BrokerageCompass - Navigate Your Real Estate Career",
    description: "Professional tool to compare commission splits and earnings across real estate brokerages.",
    site: "@BrokerageCompass",
    creator: "@NickBellante",
    images: ["/og-image.png"]
  },
  
  // SEO
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
  
  // Verification
  verification: {
    google: 'kppn5qoOQ8UYxMl1Wn_p96DxEAq1XmfQkepQ95nzLzE',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  
  // Other metadata
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Viewport and basic meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BrokerageCompass" />
        
        {/* Additional favicon support for older browsers */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Microsoft Windows tiles */}
        <meta name="msapplication-TileColor" content="#475569" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Analytics - Required in head for Search Console verification */}
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
