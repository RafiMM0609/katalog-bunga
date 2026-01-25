import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: "Kagitacraft - Bunga Abadi Penuh Makna",
  description: "Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu. Bunga wisuda, hadiah guru, kado ulang tahun, buket pernikahan, dan anniversary.",
  keywords: ["bunga", "hadiah", "wisuda", "pernikahan", "ultah", "guru", "anniversary", "buket"],
  authors: [{ name: "Kagitacraft" }],
  openGraph: {
    title: "Kagitacraft - Bunga Abadi Penuh Makna",
    description: "Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu.",
    url: "https://kagitacraft.com",
    siteName: "Kagitacraft",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kagitacraft - Bunga Abadi",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kagitacraft - Bunga Abadi Penuh Makna",
    description: "Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
          {children}
        </main>
        {modal}
        <Footer />
      </body>
    </html>
  );
}
