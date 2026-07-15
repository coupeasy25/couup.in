"use client";

import { Menu, Heart, Briefcase, CalendarDays, Home, LayoutDashboard, PlusCircle, LogOut, LogIn, UserPlus, User, Tag, HelpCircle } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";

interface UserMenuProps {
  currentUser?: any | null; 
  isScrolledStyle?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, isScrolledStyle = true }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Small delay to allow cursor to reach dropdown
  };

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    router.push('/become-a-host');
  }, [currentUser, loginModal, router]);

  return (
    <div className={`flex flex-row items-center gap-1 ${isScrolledStyle ? 'text-neutral-800' : 'text-white'}`}>
      <div 
        onClick={() => {
          if (!currentUser) return loginModal.onOpen();
          router.push('/trips');
        }}
        className={`hidden md:flex flex-row items-center gap-2 text-[14px] font-medium py-2.5 px-4 rounded-full transition cursor-pointer ${isScrolledStyle ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
      >
        <Briefcase size={16} strokeWidth={2.5} />
        <span>Trips</span>
      </div>
      <div 
        onClick={() => {
          if (!currentUser) return loginModal.onOpen();
          router.push('/favorites');
        }}
        className={`hidden md:flex flex-row items-center gap-2 text-[14px] font-medium py-2.5 px-4 rounded-full transition cursor-pointer ${isScrolledStyle ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
      >
        <Heart size={16} strokeWidth={2.5} />
        <span>Wishlist</span>
      </div>
      <div 
        onClick={onRent}
        className={`hidden md:block text-[14px] font-medium py-2.5 px-4 rounded-full transition cursor-pointer ${isScrolledStyle ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
      >
        Become a host
      </div>

      <div 
        className="relative ml-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          onClick={toggleOpen}
          className={`p-4 md:py-[7px] md:pl-3 md:pr-2 border-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.1)] flex flex-row items-center gap-3 rounded-full cursor-pointer transition ${isScrolledStyle ? 'border-neutral-200 bg-white text-neutral-800' : 'border-white/50 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:border-white/80'}`}
        >
          <Menu size={18} strokeWidth={2.5} className="ml-1" />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 w-[80vw] md:w-[260px] bg-white overflow-hidden right-0 top-14 text-sm text-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="flex flex-col cursor-pointer py-2">
              {currentUser ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-neutral-100 mb-2 bg-neutral-50/50">
                    <Avatar src={currentUser?.image} />
                    <div className="flex flex-col">
                      <span className="font-bold text-black">{currentUser.name}</span>
                      <span className="text-xs text-neutral-500">{currentUser.email}</span>
                    </div>
                  </div>
                  
                  <MenuItem icon={<User size={16} />} onClick={() => { setIsOpen(false); router.push('/profile'); }} label="Personal Information" />
                  <MenuItem icon={<Briefcase size={16} />} onClick={() => { setIsOpen(false); router.push('/trips'); }} label="Bookings" />
                  <MenuItem icon={<Tag size={16} />} onClick={() => { setIsOpen(false); router.push('/offers'); }} label="Offers" />
                  <MenuItem icon={<HelpCircle size={16} />} onClick={() => { setIsOpen(false); router.push('/help'); }} label="Help" />
                  <hr className="my-2 border-neutral-100" />
                  
                  {currentUser?.isHost && (
                    <>
                      <MenuItem icon={<Home size={16} />} onClick={() => { setIsOpen(false); router.push('/host/properties'); }} label="My properties" />
                      <MenuItem icon={<LayoutDashboard size={16} />} onClick={() => { setIsOpen(false); router.push('/host/dashboard'); }} label="Host Dashboard" />
                      <MenuItem icon={<PlusCircle size={16} />} onClick={() => { setIsOpen(false); onRent(); }} label="Couup a new property" />
                      <hr className="my-2 border-neutral-100" />
                    </>
                  )}
                  
                  <MenuItem icon={<LogOut size={16} />} isDanger onClick={() => { setIsOpen(false); signOut(); }} label="Logout" />
                </>
              ) : (
                <>
                  <MenuItem icon={<LogIn size={16} />} onClick={() => { setIsOpen(false); loginModal.onOpen(); }} label="Log in" />
                  <MenuItem icon={<UserPlus size={16} />} onClick={() => { setIsOpen(false); registerModal.onOpen(); }} label="Sign up" />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserMenu;
