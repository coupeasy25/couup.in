import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import LoginModal from "@/components/modals/LoginModal";
import FilterModal from "@/components/modals/FilterModal";
import BookingSuccessModal from "@/components/modals/BookingSuccessModal";
import getCurrentUser from "@/actions/getCurrentUser";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.couup.in'),
  title: {
    template: "%s | COUUP",
    default: "COUUP | Exclusive Hotels & Resorts in India",
  },
  description: "Discover and book exclusive hotels, resorts, and vacation rentals curated for your perfect getaway in India.",
  keywords: ["hotels", "resorts", "vacation rentals", "travel", "booking", "Couup", "India stays", "luxury stays"],
  authors: [{ name: "COUUP" }],
  creator: "COUUP",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.couup.in",
    title: "Couup Hotels & Resorts",
    description: "Discover and book exclusive hotels, resorts, and unforgettable experiences curated for your perfect getaway in India.",
    siteName: "Couup",
    images: [
      {
        url: "/images/logo-2.png", // Fallback, could be a specific OG banner later
        width: 1200,
        height: 630,
        alt: "Couup Hotels & Resorts",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Couup Hotels & Resorts",
    description: "Book the best stays and unforgettable experiences.",
    images: ["/images/logo-2.png"],
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
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/logo-2.jpeg',
    apple: '/images/logo-2.png',
  }
};

import ClientLayout from "@/components/ClientLayout";
import { getActiveAmenities } from "@/actions/getAmenities";
import getDestinations from "@/actions/getDestinations";

import NextTopLoader from "nextjs-toploader";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const amenities = await getActiveAmenities();
  const destinations = await getDestinations();

  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden w-full`}>
        <NextTopLoader color="#F97316" showSpinner={false} />
        <Toaster />
        <RegisterModal />
        <LoginModal />
        <Suspense fallback={null}>
          <FilterModal amenities={amenities} />
        </Suspense>
        <BookingSuccessModal />
        
        {/* JSON-LD Schema for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "COUUP",
                "url": "https://www.couup.in",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.couup.in/?locationValue={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "COUUP",
                "url": "https://www.couup.in",
                "logo": "https://www.couup.in/images/logo-2.png",
                "sameAs": [
                  "https://www.facebook.com/couup",
                  "https://www.instagram.com/couup",
                  "https://twitter.com/couup"
                ]
              }
            ])
          }}
        />

        <ClientLayout currentUser={currentUser} amenities={amenities} destinations={destinations}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
