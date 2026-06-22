"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const RecentSearch = () => {
  return (
    <div className="flex justify-center mt-6 mb-10">
      <div className="flex flex-row items-center gap-4 border-[1px] rounded-full p-2 pr-6 shadow-sm hover:shadow-md transition cursor-pointer">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1596423735880-5c6891eb1ed0?q=80&w=200&auto=format&fit=crop" 
            alt="Recent search" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="text-sm font-semibold">
            Continue searching for homes in Udaipur
          </div>
          <div className="text-sm text-neutral-500 font-light flex items-center gap-1">
            19–20 Jun <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentSearch;
