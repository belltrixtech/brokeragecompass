import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "BrokerageCompass - Compare Real Estate Brokerages",
  description: "Professional brokerage comparison tool for real estate agents. Compare commission splits, fees, revenue share, and stock awards.",
  keywords: "real estate brokerage comparison, commission calculator, agent tools, real estate career",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' }
    ]
  },
  openGraph: {
    title: "BrokerageCompass - Compare Real Estate Brokerages",
    description: "Professional tool to compare commission splits, fees, and earnings across real estate brokerages.",
    url: "https://brokeragecompass.com",
    type: "website",
    siteName: "BrokerageCompass",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrokerageCompass",
    description: "Navigate your real estate career with confidence.",
    site: "@BrokerageCompass",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
