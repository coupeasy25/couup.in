"use client";

import Link from "next/link";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import Container from "../Container";
import useLoginModal from "@/hooks/useLoginModal";
import useSearchModal from "@/hooks/useSearchModal";
import { signOut } from "next-auth/react";
import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";
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

  // Force white navbar background always as requested by user
  const isScrolledStyle = true;

  return (
    <div
      className={`fixed w-full z-50 transition-all duration-300 border-b-[1px] ${isScrolledStyle
        ? "bg-white shadow-sm border-neutral-100 py-4"
        : "bg-transparent border-transparent py-4"
        }`}
    >
      <Container>
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center cursor-pointer transition"
          >
            <Image
              src="/images/logo-2.png"
              alt="Couup Logo"
              width={160}
              height={45}
              className="object-contain max-w-[120px] md:max-w-none"
            />
          </Link>

          {/* Center Content */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {searchModal.isOpen ? (
              <ExpandedSearch />
            ) : null}
          </div>

          {/* Mobile Expanded Search */}
          {searchModal.isOpen && (
            <div className="md:hidden absolute top-[70px] left-0 w-full px-4 z-50">
              <ExpandedSearch />
            </div>
          )}

          {/* Right Buttons */}
          <div className="flex flex-row items-center gap-3 md:gap-4">
            {/* Mobile Search Button */}
            {(!isMainPage || isScrolled) && (
              <div 
                onClick={searchModal.onOpen}
                className="md:hidden p-2.5 rounded-full border-[1px] border-neutral-200 shadow-sm hover:shadow-md cursor-pointer transition bg-white"
              >
                <SearchIcon size={18} strokeWidth={2.5} className="text-neutral-800" />
              </div>
            )}
            
            <UserMenu currentUser={currentUser} isScrolledStyle={isScrolledStyle} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
