import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import LoginModal from "@/components/modals/LoginModal";
import getCurrentUser from "@/actions/getCurrentUser";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.couup.in'),
  title: {
    template: "%s | Couup Hotels & Resorts",
    default: "Couup Hotels & Resorts - Book the best stays",
  },
  description: "Discover and book exclusive hotels, resorts, and unforgettable experiences curated for your perfect getaway in India.",
  keywords: ["hotels", "resorts", "vacation rentals", "travel", "booking", "Couup", "India stays", "luxury stays"],
  authors: [{ name: "Couup" }],
  creator: "Couup",
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
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <RegisterModal />
        <LoginModal />
        <Suspense fallback={null}>
          <Navbar currentUser={currentUser} />
        </Suspense>
        <div className="pb-20 min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
