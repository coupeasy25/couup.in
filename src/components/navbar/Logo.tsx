"use client";

import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";

const Logo = () => {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push('/')}
      className="hidden md:flex items-center cursor-pointer"
    >
      <span className="font-extrabold text-2xl tracking-tight">Couup</span>
    </div>
  );
}

export default Logo;
