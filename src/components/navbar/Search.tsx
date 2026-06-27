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
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#F97316]">Where</div>
          <div className="text-sm text-neutral-500 font-light truncate">Search your destination...</div>
        </div>

        <div className="h-8 border-l-[1px] border-neutral-300"></div>

        {/* When */}
        <div className="flex flex-col flex-1 px-6 py-2 hover:bg-neutral-100 rounded-full transition">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#F97316]">When</div>
          <div className="text-sm text-neutral-500 font-light truncate">Add check-in</div>
        </div>

        <div className="h-8 border-l-[1px] border-neutral-300"></div>

        {/* Who */}
        <div className="flex flex-row items-center flex-1 justify-between pl-6 pr-2 py-2 hover:bg-neutral-100 rounded-full transition">
          <div className="flex flex-col">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#F97316]">Who</div>
            <div className="text-sm text-neutral-500 font-light truncate">Who's coming?</div>
          </div>

          <div className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-[#FFFFFF] border-[1px] border-[#FFFFFF]/30 rounded-full font-bold flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] uppercase tracking-wider text-[11px]">
            <SearchIcon size={16} strokeWidth={2.5} />
            <span>Search</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Search;
