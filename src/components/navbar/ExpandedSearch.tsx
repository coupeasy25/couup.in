"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import { formatISO, format, addDays, isSameDay } from "date-fns";
import toast from "react-hot-toast";
import useSearchModal from "@/hooks/useSearchModal";
import Calendar from "../inputs/Calendar";

interface ExpandedSearchProps {
  isHero?: boolean;
}

const ExpandedSearch: React.FC<ExpandedSearchProps> = ({ isHero }) => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [activeTab, setActiveTab] = useState<"where" | "checkin" | "checkout" | "who" | null>(null);
  const [locationValue, setLocationValue] = useState(params?.get('locationValue') || "");
  const urlGuestCount = params?.get('guestCount') ? parseInt(params.get('guestCount') as string, 10) : 0;
  const urlStartDate = params?.get('startDate') ? new Date(params.get('startDate') as string) : undefined;
  const urlEndDate = params?.get('endDate') ? new Date(params.get('endDate') as string) : undefined;

  const [adults, setAdults] = useState(urlGuestCount);
  const [children, setChildren] = useState(0);
  
  const [dateRange, setDateRange] = useState<Range>({
    startDate: urlStartDate,
    endDate: urlEndDate,
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
        color: "bg-[#F97316]/10 text-[#F97316]"
      }))
    : [
        { name: "Nearby", desc: "Find what's around you", icon: MapPin, color: "bg-[#F97316]/10 text-[#F97316]" },
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
      color: "bg-[#FFFFFF]/20 text-[#FFFFFF]"
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

    if (dateRange.startDate && dateRange.endDate && isSameDay(dateRange.startDate, dateRange.endDate)) {
      toast.error("Please select a valid date range (Check-out must be after Check-in).");
      return;
    }

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

  const setDatesToToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDateRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    });
  };

  const setDatesToTomorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDateRange({
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 2),
      key: "selection"
    });
  };

  return (
    <div className={isHero ? "w-full flex justify-center z-20 pb-10" : "absolute top-[80px] left-0 w-full flex justify-center z-50 pb-10"}>
      {/* Background overlay - only show if not in hero */}
      {!isHero && (
        <div 
          className="fixed inset-0 bg-black/40 h-screen w-screen -z-10"
          onClick={() => searchModal.onClose()}
        ></div>
      )}

      <div className="relative w-full max-w-[1150px] mx-4" onMouseLeave={() => setActiveTab(null)}>
        <div className="bg-white rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.16)] border border-neutral-300 flex flex-col md:flex-row w-full h-[88px] items-center">
          
          {/* Location */}
          <div 
            onClick={() => setActiveTab("where")}
            onMouseEnter={() => setActiveTab("where")}
            className={`flex-1 flex flex-col justify-center px-8 h-full hover:bg-neutral-100 cursor-pointer rounded-l-full transition ${activeTab === "where" ? "bg-neutral-100 shadow-md z-10" : ""}`}
          >
            <span className="text-[13px] text-black font-medium">Where to?</span>
            <input 
              type="text" 
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              placeholder="Search your destination..." 
              className="text-[17px] font-bold text-neutral-900 bg-transparent outline-none w-full placeholder:text-neutral-400 placeholder:font-normal"
              suppressHydrationWarning
            />
          </div>

          {/* Check In */}
          <div 
            onClick={() => setActiveTab("checkin")}
            onMouseEnter={() => setActiveTab("checkin")}
            className={`flex-[0.6] flex flex-col justify-center px-6 h-full hover:bg-neutral-100 cursor-pointer transition ${activeTab === "checkin" ? "bg-neutral-100 shadow-md z-10 rounded-full" : ""}`}
          >
            <span className="text-[13px] text-black font-medium">Check in</span>
            <span className={`text-[17px] ${dateRange.startDate ? 'font-bold text-neutral-900' : 'text-neutral-400'}`}>
              {dateRange.startDate ? format(dateRange.startDate, "MMM d") : "Add check-in"}
            </span>
          </div>

          {/* Check Out */}
          <div 
            onClick={() => setActiveTab("checkout")}
            onMouseEnter={() => setActiveTab("checkout")}
            className={`flex-[0.6] flex flex-col justify-center px-6 h-full hover:bg-neutral-100 cursor-pointer transition ${activeTab === "checkout" ? "bg-neutral-100 shadow-md z-10 rounded-full" : ""}`}
          >
            <span className="text-[13px] text-black font-medium">Check out</span>
            <span className={`text-[17px] ${dateRange.endDate && dateRange.startDate !== dateRange.endDate ? 'font-bold text-neutral-900' : 'text-neutral-400'}`}>
              {dateRange.endDate && dateRange.startDate !== dateRange.endDate ? format(dateRange.endDate, "MMM d") : "Add check-out"}
            </span>
          </div>

          {/* Guests */}
          <div 
            onClick={() => setActiveTab("who")}
            onMouseEnter={() => setActiveTab("who")}
            className={`flex-[0.8] flex flex-row items-center justify-between pl-6 pr-2 h-full hover:bg-neutral-100 cursor-pointer rounded-r-full transition relative ${activeTab === "who" ? "bg-neutral-100 shadow-md z-10" : ""}`}
          >
            <div className="flex flex-col justify-center flex-1">
              <span className="text-[13px] text-black font-medium">Guests</span>
              <span className={`text-[17px] ${guestCount > 0 ? 'font-bold text-neutral-900' : 'text-neutral-400'}`}>
                {guestCount > 0 ? `${guestCount} guests` : "Who's coming?"}
              </span>
            </div>
            
            {/* Search Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSearch();
              }}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white h-[68px] w-[68px] rounded-full flex items-center justify-center transition-transform hover:scale-105"
            >
              <Search size={26} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        
        {/* Location Dropdown */}
        {activeTab === "where" && (
          <div className="absolute top-full left-0 w-full max-w-[450px] pt-3 z-50">
            <div className="bg-white rounded-3xl shadow-xl border-[1px] border-neutral-200 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="text-xs font-bold text-black">Suggested destinations</div>
              
              <div className="flex flex-col gap-1">
                {optionsToShow.map((dest, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      const searchName = dest.name === "Nearby" ? "Ahmedabad" : dest.name.split(",")[0];
                      setLocationValue(searchName);
                      setActiveTab("checkin"); // Auto advance to when
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
        {(activeTab === "checkin" || activeTab === "checkout") && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[850px] pt-3 z-50">
            <div className="bg-white rounded-3xl shadow-xl border-[1px] border-neutral-200 p-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="transform scale-[1.15] origin-top pb-8 mt-4">
                <Calendar
                  onChange={(value) => setDateRange(value.selection)}
                  value={dateRange}
                  months={2}
                  direction="horizontal"
                />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("who");
                }}
                className="mt-6 bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Who Dropdown */}
        {activeTab === "who" && (
          <div className="absolute top-full right-0 w-[400px] pt-3 z-50">
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
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 transition"
                  >
                    -
                  </button>
                  <div className="font-light text-neutral-600 w-4 text-center">{adults}</div>
                  <button 
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 transition"
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
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 transition"
                  >
                    -
                  </button>
                  <div className="font-light text-neutral-600 w-4 text-center">{children}</div>
                  <button 
                    onClick={() => setChildren((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 transition"
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
