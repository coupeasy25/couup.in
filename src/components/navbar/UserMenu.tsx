"use client";

import { Menu, Heart } from "lucide-react";
import { useCallback, useState } from "react";
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

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

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
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div 
          onClick={toggleOpen}
          className={`p-4 md:py-2 md:px-3 border-[1px] flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition ${isScrolledStyle ? 'border-neutral-200 bg-white text-black' : 'border-white/30 bg-white/10 text-white hover:bg-white/20'}`}
        >
          <Menu size={20} strokeWidth={2.5} />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[240px] bg-white overflow-hidden right-0 top-12 text-sm text-black">
            <div className="flex flex-col cursor-pointer">
              {currentUser ? (
                <>
                  <MenuItem onClick={() => router.push('/trips')} label="My trips" />
                  <MenuItem onClick={() => router.push('/favorites')} label="My favorites" />
                  {currentUser?.isHost && (
                    <>
                      <MenuItem onClick={() => router.push('/host/reservations')} label="My reservations" />
                      <MenuItem onClick={() => router.push('/host/properties')} label="My properties" />
                      <MenuItem onClick={() => router.push('/host/dashboard')} label="Host Dashboard" />
                    </>
                  )}
                  <MenuItem onClick={onRent} label="Airbnb my home" />
                  <hr />
                  <MenuItem onClick={() => signOut()} label="Logout" />
                </>
              ) : (
                <>
                  <MenuItem onClick={loginModal.onOpen} label="Login" />
                  <MenuItem onClick={registerModal.onOpen} label="Sign up" />
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
