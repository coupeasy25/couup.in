"use client";

import { Menu, Heart } from "lucide-react";
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
    <div className={`flex flex-row items-center gap-3 ${isScrolledStyle ? 'text-black' : 'text-white'}`}>
      <div 
        onClick={() => {
          if (!currentUser) return loginModal.onOpen();
          router.push('/favorites');
        }}
        className={`hidden md:flex flex-row items-center gap-2 text-[15px] font-bold py-3 px-5 rounded-full transition cursor-pointer ${isScrolledStyle ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
      >
        <Heart size={18} strokeWidth={2.5} />
        <span>Wishlist</span>
      </div>
      <div 
        onClick={onRent}
        className={`hidden md:block text-[15px] font-bold py-3 px-5 rounded-full transition cursor-pointer ${isScrolledStyle ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
      >
        Become a host
      </div>

      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          onClick={toggleOpen}
          className={`p-4 md:py-2 md:px-3 border-[1px] flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition ${isScrolledStyle ? 'border-neutral-200 bg-white text-black' : 'border-white/50 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:border-white/80'}`}
        >
          <Menu size={20} strokeWidth={2.5} />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 w-[40vw] md:w-[260px] bg-white overflow-hidden right-0 top-14 text-sm text-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
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
                  
                  <MenuItem onClick={() => { setIsOpen(false); router.push('/trips'); }} label="My trips" />
                  <MenuItem onClick={() => { setIsOpen(false); router.push('/favorites'); }} label="My favorites" />
                  
                  <hr className="my-2 border-neutral-100" />
                  
                  {currentUser?.isHost && (
                    <>
                      <MenuItem onClick={() => { setIsOpen(false); router.push('/host/reservations'); }} label="My reservations" />
                      <MenuItem onClick={() => { setIsOpen(false); router.push('/host/properties'); }} label="My properties" />
                      <MenuItem onClick={() => { setIsOpen(false); router.push('/host/dashboard'); }} label="Host Dashboard" />
                      <MenuItem onClick={() => { setIsOpen(false); onRent(); }} label="Couup a new property" />
                    </>
                  )}
                  
                  <hr className="my-2 border-neutral-100" />
                  
                  <MenuItem onClick={() => { setIsOpen(false); signOut(); }} label="Logout" />
                </>
              ) : (
                <>
                  <MenuItem onClick={() => { setIsOpen(false); loginModal.onOpen(); }} label="Log in" />
                  <MenuItem onClick={() => { setIsOpen(false); registerModal.onOpen(); }} label="Sign up" />
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
