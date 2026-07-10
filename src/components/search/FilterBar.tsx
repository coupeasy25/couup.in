"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
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

  useEffect(() => {
    getActiveAmenities().then((data) => setActiveAmenities(data));
  }, []);

  const currentAmenities = params?.get("amenities")?.split(",") || [];
  const petsAllowed = params?.get("petsAllowed") === "true";
  const freeCancellation = params?.get("freeCancellation") === "true";

  const dynamicQuickFilters = useMemo(() => {
    const filters = activeAmenities
      .filter((a) => a.isQuickFilter && a.isActive)
      .map((a) => ({ label: a.name, type: "amenity" as const }));

    // Always include these specific custom filters
    filters.push({ label: "Allows pets", type: "custom" as const, key: "petsAllowed" as any });
    filters.push({ label: "Free cancellation", type: "custom" as const, key: "freeCancellation" as any });

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

  const isActive = (filter: { label: string; type: "amenity" | "custom"; key?: string }) => {
    if (filter.type === "amenity") {
      return currentAmenities.includes(filter.label);
    }
    if (filter.key === "petsAllowed") return petsAllowed;
    if (filter.key === "freeCancellation") return freeCancellation;
    return false;
  };

  return (
    <div className="w-full flex items-center justify-between py-4 bg-white sticky top-20 z-30">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full pl-4 md:pl-0 pr-4">

        {/* Main Filters Button */}
        <button
          onClick={filterModal.onOpen}
          className="flex-shrink-0 flex items-center gap-2 border-[1.5px] border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-semibold hover:border-black transition hover:bg-neutral-50"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-neutral-200 flex-shrink-0 mx-1 hidden md:block"></div>

        {/* Quick Toggles */}
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
