"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import useFilterModal from "@/hooks/useFilterModal";
import { getActiveAmenities } from "@/actions/getAmenities";

interface FilterBarProps {
  amenities?: { name: string; isQuickFilter: boolean; isActive: boolean }[];
}

export default function FilterBar({ amenities: initialAmenities = [] }: FilterBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const filterModal = useFilterModal();
  const [activeAmenities, setActiveAmenities] = useState(initialAmenities);

  const [showPricePopover, setShowPricePopover] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState<string>("");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>("");
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const min = params?.get("minPrice");
    const max = params?.get("maxPrice");
    setLocalMinPrice(min || "");
    setLocalMaxPrice(max || "");
  }, [params]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setShowPricePopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getActiveAmenities().then((data) => setActiveAmenities(data));
  }, []);

  const currentAmenities = params?.get("amenities")?.split(",") || [];
  const petsAllowed = params?.get("petsAllowed") === "true";
  const freeCancellation = params?.get("freeCancellation") === "true";

  const dynamicQuickFilters = useMemo(() => {
    const filters: Array<{ label: string; type: "amenity" | "custom"; key?: string }> = activeAmenities
      .filter((a) => a.isQuickFilter && a.isActive)
      .map((a) => ({ label: a.name, type: "amenity" as const }));

    // Always include these specific custom filters
    filters.push({ label: "Allows pets", type: "custom" as const, key: "petsAllowed" });
    filters.push({ label: "Free cancellation", type: "custom" as const, key: "freeCancellation" });

    return filters;
  }, [activeAmenities]);

  const toggleFilter = useCallback((filter: { label: string; type: "amenity" | "custom"; key?: string }) => {
    let currentQuery: any = {};
    if (params) {
      params.forEach((value, key) => {
        currentQuery[key] = value;
      });
    }

    if (filter.type === "amenity") {
      let updatedAmenities = [...currentAmenities];
      if (updatedAmenities.includes(filter.label)) {
        updatedAmenities = updatedAmenities.filter((a) => a !== filter.label);
      } else {
        updatedAmenities.push(filter.label);
      }

      if (updatedAmenities.length > 0) {
        currentQuery.amenities = updatedAmenities.join(",");
      } else {
        delete currentQuery.amenities;
      }
    } else if (filter.type === "custom" && filter.key) {
      if (currentQuery[filter.key] === "true") {
        delete currentQuery[filter.key];
      } else {
        currentQuery[filter.key] = "true";
      }
    }

    const url = new URLSearchParams(currentQuery).toString();
    router.push(`/?${url}`, { scroll: false });
  }, [params, currentAmenities, router]);

  const applyPriceFilter = useCallback(() => {
    let currentQuery: any = {};
    if (params) {
      params.forEach((value, key) => {
        currentQuery[key] = value;
      });
    }
    if (localMinPrice) currentQuery.minPrice = localMinPrice;
    else delete currentQuery.minPrice;
    if (localMaxPrice) currentQuery.maxPrice = localMaxPrice;
    else delete currentQuery.maxPrice;
    
    const url = new URLSearchParams(currentQuery).toString();
    router.push(`/?${url}`, { scroll: false });
    setShowPricePopover(false);
  }, [localMinPrice, localMaxPrice, params, router]);
  
  const clearPriceFilter = useCallback(() => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    let currentQuery: any = {};
    if (params) {
      params.forEach((value, key) => {
        currentQuery[key] = value;
      });
    }
    delete currentQuery.minPrice;
    delete currentQuery.maxPrice;
    const url = new URLSearchParams(currentQuery).toString();
    router.push(`/?${url}`, { scroll: false });
    setShowPricePopover(false);
  }, [params, router]);

  const isActive = (filter: { label: string; type: "amenity" | "custom"; key?: string }) => {
    if (filter.type === "amenity") {
      return currentAmenities.includes(filter.label);
    }
    if (filter.key === "petsAllowed") return petsAllowed;
    if (filter.key === "freeCancellation") return freeCancellation;
    return false;
  };

  return (
    <div className="w-full flex items-center py-4 bg-white sticky top-[80px] z-30 gap-3 pl-4 md:pl-0">
      
      {/* Static Buttons Group (Not scrollable, allows popovers) */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Main Filters Button */}
        <button
          onClick={filterModal.onOpen}
          className="flex-shrink-0 flex items-center gap-2 border-[1.5px] border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-black transition hover:bg-neutral-50"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {/* Price Filter Popover */}
        <div className="relative flex-shrink-0" ref={priceRef}>
          <button
            onClick={() => setShowPricePopover(!showPricePopover)}
            className={`flex items-center gap-2 border-[1.5px] rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              params?.get("minPrice") || params?.get("maxPrice") 
                ? "border-black bg-neutral-100 text-black" 
                : "border-neutral-300 hover:border-black hover:bg-neutral-50"
            }`}
          >
            Price <ChevronDown size={16} />
          </button>
          
          {showPricePopover && (
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-neutral-200 shadow-xl rounded-2xl p-5 z-50">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-neutral-500 font-medium">Min Price</label>
                    <div className="flex flex-row items-center border border-neutral-400 rounded-xl p-3">
                      <span className="text-neutral-700 mr-2">₹</span>
                      <input
                        type="number"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        className="w-full outline-none text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="text-neutral-400 mt-5">-</div>
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs text-neutral-500 font-medium">Max Price</label>
                    <div className="flex flex-row items-center border border-neutral-400 rounded-xl p-3">
                      <span className="text-neutral-700 mr-2">₹</span>
                      <input
                        type="number"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className="w-full outline-none text-sm"
                        placeholder="25000+"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between mt-2 pt-4 border-t border-neutral-100">
                  <button onClick={clearPriceFilter} className="underline text-sm font-semibold hover:text-neutral-600 transition">Clear</button>
                  <button onClick={applyPriceFilter} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition">Apply</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-neutral-200 flex-shrink-0 mx-1 hidden md:block"></div>
      </div>

      {/* Scrollable Quick Toggles */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full pr-4 pb-1">
        {dynamicQuickFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => toggleFilter(filter)}
            className={`flex-shrink-0 border-[1.5px] rounded-full px-4 py-2.5 text-sm font-semibold transition ${isActive(filter)
                ? "border-black bg-neutral-100 text-black"
                : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
