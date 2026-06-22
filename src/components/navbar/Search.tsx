"use client";

import { Search as SearchIcon, MapPin, CalendarDays, User } from "lucide-react";
import useSearchModal from "@/hooks/useSearchModal";

const Search = () => {
  const searchModal = useSearchModal();

  return (
    <div 
      onClick={searchModal.onOpen}
      className="w-full max-w-4xl rounded-full bg-white shadow-xl py-2 px-4 cursor-pointer hover:shadow-2xl transition"
    >
      <div className="flex flex-row items-center justify-between">

        {/* Where */}
        <div className="flex flex-col flex-1 px-6 py-2 hover:bg-neutral-100 rounded-full transition">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#0f3d30]">Where</div>
          <div className="text-sm text-neutral-500 font-light truncate">Search destinations</div>
        </div>

        <div className="h-8 border-l-[1px] border-neutral-300"></div>

        {/* When */}
        <div className="flex flex-col flex-1 px-6 py-2 hover:bg-neutral-100 rounded-full transition">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#0f3d30]">When</div>
          <div className="text-sm text-neutral-500 font-light truncate">Add dates</div>
        </div>

        <div className="h-8 border-l-[1px] border-neutral-300"></div>

        {/* Who */}
        <div className="flex flex-row items-center flex-1 justify-between pl-6 pr-2 py-2 hover:bg-neutral-100 rounded-full transition">
          <div className="flex flex-col">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#0f3d30]">Who</div>
            <div className="text-sm text-neutral-500 font-light truncate">Add guests</div>
          </div>

          <div className="px-6 py-3 bg-[#0f3d30] hover:bg-[#082b20] text-[#D4AF37] border-[1px] border-[#D4AF37]/30 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] uppercase tracking-wider text-[11px]">
            <SearchIcon size={16} strokeWidth={2.5} />
            <span>Search</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Search;
