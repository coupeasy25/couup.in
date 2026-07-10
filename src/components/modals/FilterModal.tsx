"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";
import useFilterModal from "@/hooks/useFilterModal";
import { getActiveAmenities } from "@/actions/getAmenities";
import getFilterSettings from "@/actions/getFilterSettings";

interface FilterModalProps {
  amenities?: { name: string; isQuickFilter: boolean; isActive: boolean }[];
}

const FilterModal = ({ amenities: initialAmenities = [] }: FilterModalProps) => {
  const filterModal = useFilterModal();
  const router = useRouter();
  const params = useSearchParams();

  const [activeAmenities, setActiveAmenities] = useState(initialAmenities);
  const [filterSettings, setFilterSettings] = useState<any>(null);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [roomCount, setRoomCount] = useState<number | "">("");
  const [bathroomCount, setBathroomCount] = useState<number | "">("");
  
  // Dynamic selections
  const [selectedBookingOptions, setSelectedBookingOptions] = useState<string[]>([]);
  const [selectedHouseRules, setSelectedHouseRules] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedCustomerRatings, setSelectedCustomerRatings] = useState<number[]>([]);

  useEffect(() => {
    getActiveAmenities().then((data) => setActiveAmenities(data));
    getFilterSettings().then((data) => setFilterSettings(data));
  }, []);

  useEffect(() => {
    if (filterModal.isOpen) {
      // Initialize local state from URL when modal opens
      setSelectedAmenities(params?.get("amenities")?.split(",").filter(Boolean) || []);
      setSelectedBookingOptions(params?.get("bookingOptions")?.split(",").filter(Boolean) || []);
      setSelectedHouseRules(params?.get("houseRules")?.split(",").filter(Boolean) || []);
      setSelectedPropertyTypes(params?.get("propertyTypes")?.split(",").filter(Boolean) || []);
      setSelectedCustomerRatings(params?.get("customerRatings")?.split(",").map(Number).filter(Boolean) || []);
      
      setMinPrice(params?.get("minPrice") ? Number(params.get("minPrice")) : "");
      setMaxPrice(params?.get("maxPrice") ? Number(params.get("maxPrice")) : "");
      setRoomCount(params?.get("roomCount") ? Number(params.get("roomCount")) : "");
      setBathroomCount(params?.get("bathroomCount") ? Number(params.get("bathroomCount")) : "");
    }
  }, [filterModal.isOpen, params]);

  const toggleSelection = (item: any, selected: any[], setSelected: any) => {
    if (selected.includes(item)) {
      setSelected((prev: any[]) => prev.filter((a) => a !== item));
    } else {
      setSelected((prev: any[]) => [...prev, item]);
    }
  };

  const onSubmit = useCallback(() => {
    let currentQuery: any = {};
    if (params) {
      params.forEach((value, key) => {
        currentQuery[key] = value;
      });
    }

    if (selectedAmenities.length > 0) currentQuery.amenities = selectedAmenities.join(",");
    else delete currentQuery.amenities;

    if (selectedBookingOptions.length > 0) currentQuery.bookingOptions = selectedBookingOptions.join(",");
    else delete currentQuery.bookingOptions;

    if (selectedHouseRules.length > 0) currentQuery.houseRules = selectedHouseRules.join(",");
    else delete currentQuery.houseRules;

    if (selectedPropertyTypes.length > 0) currentQuery.propertyTypes = selectedPropertyTypes.join(",");
    else delete currentQuery.propertyTypes;

    if (selectedCustomerRatings.length > 0) currentQuery.customerRatings = selectedCustomerRatings.join(",");
    else delete currentQuery.customerRatings;

    if (minPrice !== "") currentQuery.minPrice = minPrice;
    else delete currentQuery.minPrice;
    
    if (maxPrice !== "") currentQuery.maxPrice = maxPrice;
    else delete currentQuery.maxPrice;

    if (roomCount !== "") currentQuery.roomCount = roomCount;
    else delete currentQuery.roomCount;

    if (bathroomCount !== "") currentQuery.bathroomCount = bathroomCount;
    else delete currentQuery.bathroomCount;

    // Handle legacy petsAllowed/freeCancellation if selected via new dynamic filters for backward compatibility
    if (selectedBookingOptions.includes("Free cancellation")) currentQuery.freeCancellation = "true";
    else delete currentQuery.freeCancellation;
    
    if (selectedHouseRules.includes("Allows pets")) currentQuery.petsAllowed = "true";
    else delete currentQuery.petsAllowed;

    const url = new URLSearchParams(currentQuery).toString();
    router.push(`/?${url}`, { scroll: false });
    filterModal.onClose();
  }, [
    selectedAmenities, selectedBookingOptions, selectedHouseRules, selectedPropertyTypes, 
    selectedCustomerRatings, minPrice, maxPrice, roomCount, bathroomCount, 
    params, router, filterModal
  ]);

  const onClearAll = () => {
    setSelectedAmenities([]);
    setSelectedBookingOptions([]);
    setSelectedHouseRules([]);
    setSelectedPropertyTypes([]);
    setSelectedCustomerRatings([]);
    setMinPrice("");
    setMaxPrice("");
    setRoomCount("");
    setBathroomCount("");
  };

  const bodyContent = (
    <div className="flex flex-col gap-8 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
      
      {/* Price Range */}
      {filterSettings?.showPriceFilter !== false && (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-800">Price range</h3>
            <p className="text-neutral-500">Nightly prices before fees and taxes</p>
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-col flex-1 gap-1">
                <label className="text-xs text-neutral-500 font-medium">Minimum</label>
                <div className="flex flex-row items-center border-[1px] border-neutral-400 rounded-xl p-3">
                  <span className="text-neutral-700 mr-2">₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="text-neutral-400">-</div>
              <div className="flex flex-col flex-1 gap-1">
                <label className="text-xs text-neutral-500 font-medium">Maximum</label>
                <div className="flex flex-row items-center border-[1px] border-neutral-400 rounded-xl p-3">
                  <span className="text-neutral-700 mr-2">₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full outline-none"
                    placeholder="25000+"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Property Types */}
      {filterSettings?.showPropertyTypeFilter !== false && filterSettings?.propertyTypes?.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-800">Property Type</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {filterSettings.propertyTypes.map((type: string) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-neutral-300 text-black focus:ring-black accent-black"
                    checked={selectedPropertyTypes.includes(type)}
                    onChange={() => toggleSelection(type, selectedPropertyTypes, setSelectedPropertyTypes)}
                  />
                  <span className="text-neutral-800">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Customer Ratings */}
      {filterSettings?.showCustomerRatingFilter !== false && filterSettings?.customerRatings?.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-800">Customer Rating</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {filterSettings.customerRatings.map((rating: number) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-neutral-300 text-black focus:ring-black accent-black"
                    checked={selectedCustomerRatings.includes(rating)}
                    onChange={() => toggleSelection(rating, selectedCustomerRatings, setSelectedCustomerRatings)}
                  />
                  <span className="text-neutral-800">{rating}+ Stars</span>
                </label>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Rooms and beds */}
      {filterSettings?.showRoomsFilter !== false && (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-800">Rooms and beds</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center justify-between">
                <div className="text-lg font-medium text-neutral-800">Bedrooms</div>
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={() => setRoomCount((prev) => (prev && prev > 1 ? Number(prev) - 1 : ""))}
                    className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition"
                  >
                    -
                  </button>
                  <div className="font-light text-xl text-neutral-600 w-4 text-center">
                    {roomCount || "Any"}
                  </div>
                  <button
                    onClick={() => setRoomCount((prev) => (prev ? Number(prev) + 1 : 1))}
                    className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between">
                <div className="text-lg font-medium text-neutral-800">Bathrooms</div>
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={() => setBathroomCount((prev) => (prev && prev > 1 ? Number(prev) - 1 : ""))}
                    className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition"
                  >
                    -
                  </button>
                  <div className="font-light text-xl text-neutral-600 w-4 text-center">
                    {bathroomCount || "Any"}
                  </div>
                  <button
                    onClick={() => setBathroomCount((prev) => (prev ? Number(prev) + 1 : 1))}
                    className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 hover:border-black hover:text-black transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Amenities */}
      {activeAmenities.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-800">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
              {activeAmenities.filter(a => a.isActive).map((amenityObj) => (
                <label key={amenityObj.name} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-neutral-300 text-black focus:ring-black accent-black"
                    checked={selectedAmenities.includes(amenityObj.name)}
                    onChange={() => toggleSelection(amenityObj.name, selectedAmenities, setSelectedAmenities)}
                  />
                  <span className="text-neutral-800">{amenityObj.name}</span>
                </label>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      {/* Booking Options */}
      {filterSettings?.bookingOptions?.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-neutral-800">Booking options</h3>
            <div className="flex flex-col gap-4">
              {filterSettings.bookingOptions.map((opt: string) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-neutral-300 text-black focus:ring-black accent-black"
                    checked={selectedBookingOptions.includes(opt)}
                    onChange={() => toggleSelection(opt, selectedBookingOptions, setSelectedBookingOptions)}
                  />
                  <span className="text-neutral-800">{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}
      
      {/* House Rules */}
      {filterSettings?.houseRules?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-neutral-800">House rules</h3>
          <div className="flex flex-col gap-4">
            {filterSettings.houseRules.map((rule: string) => (
              <label key={rule} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded border-neutral-300 text-black focus:ring-black accent-black"
                  checked={selectedHouseRules.includes(rule)}
                  onChange={() => toggleSelection(rule, selectedHouseRules, setSelectedHouseRules)}
                />
                <span className="text-neutral-800">{rule}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={filterModal.isOpen}
      onClose={filterModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel="Show results"
      secondaryActionLabel="Clear all"
      secondaryAction={onClearAll}
      body={bodyContent}
      className="sm:max-w-[780px]"
    />
  );
};

export default FilterModal;
