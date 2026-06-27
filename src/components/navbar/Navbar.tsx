"use client";

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
        ? "bg-white shadow-md border-neutral-200 py-3"
        : "bg-transparent border-transparent py-4"
        }`}
    >
      <Container>
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="flex items-center cursor-pointer transition"
          >
            <Image
              src="/images/logo-2.png"
              alt="Couup Logo"
              width={160}
              height={45}
              className="object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            {searchModal.isOpen ? (
              <ExpandedSearch />
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
