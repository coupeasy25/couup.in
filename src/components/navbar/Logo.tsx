"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

const Logo = () => {
  return (
    <Link 
      href="/"
      className="hidden md:flex items-center cursor-pointer"
    >
      <span className="font-extrabold text-2xl tracking-tight">Couup</span>
    </Link>
  );
}

export default Logo;
