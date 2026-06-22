"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Building2, Trees, Mountain } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import { formatISO, format } from "date-fns";
import useSearchModal from "@/hooks/useSearchModal";
import Calendar from "../inputs/Calendar";

interface ExpandedSearchProps {
  isHero?: boolean;
}

const ExpandedSearch: React.FC<ExpandedSearchProps> = ({ isHero }) => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [activeTab, setActiveTab] = useState<"where" | "when" | "who" | null>(null);
  const [locationValue, setLocationValue] = useState(params?.get('locationValue') || "");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const guestCount = adults + children;

  const [dynamicLocations, setDynamicLocations] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/api/locations')
      .then((res) => setDynamicLocations(res.data))
      .catch((error) => console.error("Failed to fetch locations", error));
  }, []);

  const suggestedDestinations = dynamicLocations.length > 0 
    ? dynamicLocations.map(loc => ({
        name: loc,
        desc: "Available destination",
        icon: MapPin,
        color: "bg-[#0f3d30]/10 text-[#0f3d30]"
      }))
    : [
        { name: "Nearby", desc: "Find what's around you", icon: MapPin, color: "bg-[#0f3d30]/10 text-[#0f3d30]" },
      ];

  const filteredDestinations = locationValue 
    ? suggestedDestinations.filter(d => d.name.toLowerCase().includes(locationValue.toLowerCase()))
    : suggestedDestinations;

  const optionsToShow = [...filteredDestinations];
  if (locationValue && !filteredDestinations.some(d => d.name.toLowerCase() === locationValue.toLowerCase())) {
    optionsToShow.unshift({
      name: locationValue,
      desc: "Search for this specific location",
      icon: MapPin,
      color: "bg-[#D4AF37]/20 text-[#D4AF37]"
    });
  }

  const handleSearch = () => {
    let currentQuery = {};
    if (params) {
      params.forEach((value, key) => {
        currentQuery = { ...currentQuery, [key]: value };
      });
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue,
      guestCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    if (!locationValue) {
      delete updatedQuery.locationValue;
    }

    const urlParams = new URLSearchParams(updatedQuery);
    searchModal.onClose();
    router.push(`/?${urlParams.toString()}`);
  };

  return (
    <div className={isHero ? "w-full flex justify-center z-20" : "absolute top-[80px] left-0 w-full flex justify-center z-50"}>
      {/* Background overlay - only show if not in hero */}
      {!isHero && (
        <div 
          className="fixed inset-0 bg-black/40 h-screen w-screen -z-10"
          onClick={() => searchModal.onClose()}
        ></div>
      )}

      <div 
        onMouseLeave={() => setActiveTab(null)}
        onMouseEnter={() => {
          if (!activeTab) setActiveTab("where");
        }}
        className={`${isHero ? 'bg-white/95 backdrop-blur-md' : 'bg-neutral-100/90 backdrop-blur-sm'} rounded-full flex flex-row items-center border-[1px] border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative w-full max-w-4xl mx-4`}
      >
        
        {/* Where */}
        <div 
          onClick={() => setActiveTab("where")}
          onMouseEnter={() => setActiveTab("where")}
          className={`flex-1 flex flex-col px-8 py-3.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${activeTab === "where" ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] scale-[1.02]" : "hover:bg-black/5"}`}
        >
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#0f3d30] pb-0.5">Where</div>
          <input 
            type="text"
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            placeholder="Search destinations"
            className="text-[15px] bg-transparent outline-none truncate w-full text-neutral-800 font-medium placeholder:text-neutral-500 placeholder:font-normal"
            suppressHydrationWarning
          />
        </div>

        {/* Separator */}
        {activeTab !== "where" && activeTab !== "when" && (
          <div className="h-10 border-l-[1px] border-neutral-300/80"></div>
        )}

        {/* When */}
        <div 
          onClick={() => setActiveTab("when")}
          onMouseEnter={() => setActiveTab("when")}
          className={`flex-1 flex flex-col px-8 py-3.5 rounded-full cursor-pointer transition-all duration-300 ease-out ${activeTab === "when" ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] scale-[1.02]" : "hover:bg-black/5"}`}
        >
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#0f3d30] pb-0.5">When</div>
          <div className={`text-[15px] ${dateRange.startDate && dateRange.endDate && dateRange.startDate !== dateRange.endDate ? 'font-medium text-neutral-800' : 'font-normal text-neutral-500'}`}>
            {dateRange.startDate && dateRange.endDate && dateRange.startDate !== dateRange.endDate
              ? `${format(dateRange.startDate, "MMM d")} - ${format(dateRange.endDate, "MMM d")}`
              : "Add dates"}
          </div>
        </div>

        {/* Separator */}
        {activeTab !== "when" && activeTab !== "who" && (
          <div className="h-10 border-l-[1px] border-neutral-300/80"></div>
        )}

        {/* Who & Search Button */}
        <div 
          onClick={() => setActiveTab("who")}
          onMouseEnter={() => setActiveTab("who")}
          className={`flex-1 flex flex-row items-center justify-between pl-8 pr-2 py-2 rounded-full cursor-pointer transition-all duration-300 ease-out ${activeTab === "who" ? "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] scale-[1.02]" : "hover:bg-black/5"}`}
        >
          <div className="flex flex-col">
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#0f3d30] pb-0.5">Who</div>
            <div className={`text-[15px] ${guestCount > 0 ? 'font-medium text-neutral-800' : 'font-normal text-neutral-500'}`}>
              {guestCount > 0 ? `${guestCount} guest${guestCount !== 1 ? 's' : ''}` : "Add guests"}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSearch();
            }}
            className="flex flex-row items-center gap-2 bg-[#0f3d30] hover:bg-[#082b20] text-[#D4AF37] border-[1px] border-[#D4AF37]/30 px-7 py-3.5 rounded-full font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-95 ml-4 uppercase tracking-wider text-[13px]"
            suppressHydrationWarning
          >
            <Search size={16} strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>

        {/* Location Dropdown */}
        {activeTab === "where" && (
          <div className="absolute top-full left-0 w-full max-w-[450px] pt-4 z-50">
            <div className="bg-white rounded-3xl shadow-xl border-[1px] border-neutral-200 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="text-xs font-bold text-black">Suggested destinations</div>
              
              <div className="flex flex-col gap-1">
                {optionsToShow.map((dest, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      const searchName = dest.name === "Nearby" ? "Ahmedabad" : dest.name.split(",")[0];
                      setLocationValue(searchName);
                      setActiveTab(null);
                    }}
                    className="flex flex-row items-center gap-4 hover:bg-neutral-100 p-3 rounded-xl cursor-pointer transition"
                  >
                    <div className={`p-3 rounded-xl ${dest.color}`}>
                      <dest.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[15px] font-semibold text-black">{dest.name}</div>
                      <div className="text-[13px] text-neutral-500 font-light">{dest.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Dropdown */}
        {activeTab === "when" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[850px] pt-4 z-50">
            <div className="bg-white rounded-3xl shadow-xl border-[1px] border-neutral-200 p-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex bg-neutral-100 rounded-full p-1 mb-8">
                <button className="bg-[#0f3d30] text-[#D4AF37] rounded-full px-6 py-2 shadow-sm font-semibold text-sm">Dates</button>
                <button className="rounded-full px-6 py-2 font-semibold text-sm text-neutral-500 hover:text-[#0f3d30] transition">Flexible</button>
              </div>
              <Calendar
                onChange={(value) => setDateRange(value.selection)}
                value={dateRange}
                months={2}
                direction="horizontal"
              />
            </div>
          </div>
        )}

        {/* Who Dropdown */}
        {activeTab === "who" && (
          <div className="absolute top-full right-0 w-[400px] pt-4 z-50">
            <div className="bg-white rounded-3xl shadow-xl border-[1px] border-neutral-200 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
              
              {/* Adults */}
              <div className="flex flex-row items-center justify-between py-2 border-b-[1px] border-neutral-200">
                <div className="flex flex-col">
                  <div className="text-[16px] font-semibold text-black">Adults</div>
                  <div className="text-sm font-light text-neutral-500">Ages 13 or above</div>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <button 
                    onClick={() => setAdults((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#0f3d30] hover:text-[#0f3d30] hover:bg-[#0f3d30]/5 transition"
                  >
                    -
                  </button>
                  <div className="font-light text-neutral-600 w-4 text-center">{adults}</div>
                  <button 
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#0f3d30] hover:text-[#0f3d30] hover:bg-[#0f3d30]/5 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex flex-row items-center justify-between py-2">
                <div className="flex flex-col">
                  <div className="text-[16px] font-semibold text-black">Children</div>
                  <div className="text-sm font-light text-neutral-500">Ages 2–12</div>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <button 
                    onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#0f3d30] hover:text-[#0f3d30] hover:bg-[#0f3d30]/5 transition"
                  >
                    -
                  </button>
                  <div className="font-light text-neutral-600 w-4 text-center">{children}</div>
                  <button 
                    onClick={() => setChildren((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#0f3d30] hover:text-[#0f3d30] hover:bg-[#0f3d30]/5 transition"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpandedSearch;
