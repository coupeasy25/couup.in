"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import Container from "../Container";
import useLoginModal from "@/hooks/useLoginModal";
import useSearchModal from "@/hooks/useSearchModal";
import { signOut } from "next-auth/react";
import { Search as SearchIcon } from "lucide-react";
import ExpandedSearch from "./ExpandedSearch";
import UserMenu from "./UserMenu";

interface NavbarProps {
  currentUser?: any | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const loginModal = useLoginModal();
  const searchModal = useSearchModal();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMainPage = pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If we are not on the main page, always apply the scrolled style
  const isScrolledStyle = !isMainPage || isScrolled;

  const locationValue = searchParams?.get('locationValue');
  const startDate = searchParams?.get('startDate');
  const endDate = searchParams?.get('endDate');
  const guestCount = searchParams?.get('guestCount');

  const locationLabel = locationValue || 'Anywhere';
  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = differenceInDays(end, start);
      if (diff === 0) return '1 Day';
      return `${diff} Days`;
    }
    return 'Any Week';
  }, [startDate, endDate]);

  const guestLabel = guestCount ? `${guestCount} Guests` : 'Add Guests';

  return (
    <div
      className={`fixed w-full z-50 transition-all duration-300 border-b-[1px] ${isScrolledStyle
          ? "bg-white shadow-md border-neutral-200 py-3"
          : "bg-transparent border-transparent py-4"
        }`}
    >
      <Container>
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className={`flex flex-col cursor-pointer transition ${isScrolledStyle ? 'text-[#0f3d30]' : 'text-[#D4AF37]'}`}
          >
            <div className="font-serif text-3xl tracking-[0.2em] font-medium uppercase drop-shadow-sm">Couup</div>
            <div className={`text-[9px] tracking-[0.3em] font-light uppercase text-center mt-1 ${isScrolledStyle ? 'text-neutral-500' : 'text-[#D4AF37]/80'}`}>Hotels & Resorts</div>
          </div>

          {/* Center Content: Switches between Links and Mini Search Bar */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {searchModal.isOpen ? (
              <ExpandedSearch />
            ) : isScrolledStyle ? (
              /* Mini Search Bar (Visible on Scroll) */
              <div 
                onClick={searchModal.onOpen}
                className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer flex flex-row items-center justify-between bg-white border-neutral-200 animate-in fade-in zoom-in duration-300"
              >
                <div className="text-sm font-semibold px-6 text-black">{locationLabel}</div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center text-black">{durationLabel}</div>
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                  <div className="hidden sm:block">{guestLabel}</div>
                  <div className="p-2 bg-[#0a4d3c] rounded-full text-white">
                    <SearchIcon size={14} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Buttons */}
          <div className="flex flex-row items-center gap-4">
            <UserMenu currentUser={currentUser} isScrolledStyle={isScrolledStyle} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
