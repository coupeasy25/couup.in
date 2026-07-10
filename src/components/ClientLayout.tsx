"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
  currentUser: any;
  amenities?: any[];
  destinations?: any[];
}

export default function ClientLayout({ children, currentUser, amenities, destinations }: ClientLayoutProps) {
  const pathname = usePathname();
  const isHostDashboard = pathname?.startsWith("/host");

  return (
    <>
      {!isHostDashboard && (
        <Suspense fallback={null}>
          <Navbar currentUser={currentUser} />
        </Suspense>
      )}
      
      <div className={isHostDashboard ? "min-h-screen" : "pb-20 min-h-screen"}>
        {children}
      </div>
      
      {!isHostDashboard && <Footer amenities={amenities} destinations={destinations} />}
    </>
  );
}
