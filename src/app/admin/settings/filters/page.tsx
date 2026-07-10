"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FilterSettingsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [sortOptions, setSortOptions] = useState<string[]>([]);
  const [customerRatings, setCustomerRatings] = useState<number[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<any[]>([]);
  
  // New Toggles & Options
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showRoomsFilter, setShowRoomsFilter] = useState(true);
  const [showPropertyTypeFilter, setShowPropertyTypeFilter] = useState(true);
  const [showCustomerRatingFilter, setShowCustomerRatingFilter] = useState(true);
  const [bookingOptions, setBookingOptions] = useState<string[]>([]);
  const [houseRules, setHouseRules] = useState<string[]>([]);
  
  const [newCategory, setNewCategory] = useState("");
  const [newSortOption, setNewSortOption] = useState("");
  const [newCustomerRating, setNewCustomerRating] = useState("");
  const [newPropertyType, setNewPropertyType] = useState("");
  const [newBookingOption, setNewBookingOption] = useState("");
  const [newHouseRule, setNewHouseRule] = useState("");
  
  // Price range new item
  const [newPriceLabel, setNewPriceLabel] = useState("");
  const [newPriceMin, setNewPriceMin] = useState("");
  const [newPriceMax, setNewPriceMax] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/admin/filter-settings");
      setCategories(response.data.categories || []);
      setSortOptions(response.data.sortOptions || []);
      setCustomerRatings(response.data.customerRatings || []);
      setPropertyTypes(response.data.propertyTypes || []);
      setPriceRanges(response.data.priceRanges || []);
      
      setShowPriceFilter(response.data.showPriceFilter ?? true);
      setShowRoomsFilter(response.data.showRoomsFilter ?? true);
      setShowPropertyTypeFilter(response.data.showPropertyTypeFilter ?? true);
      setShowCustomerRatingFilter(response.data.showCustomerRatingFilter ?? true);
      setBookingOptions(response.data.bookingOptions || []);
      setHouseRules(response.data.houseRules || []);
    } catch (error) {
      toast.error("Failed to load filter settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/admin/filter-settings", {
        categories,
        sortOptions,
        customerRatings,
        propertyTypes,
        priceRanges,
        showPriceFilter,
        showRoomsFilter,
        showPropertyTypeFilter,
        showCustomerRatingFilter,
        bookingOptions,
        houseRules
      });
      toast.success("Filter settings updated!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to add strings to an array
  const handleAddString = (value: string, setter: any, array: string[], resetter: any) => {
    if (value.trim() && !array.includes(value.trim())) {
      setter([...array, value.trim()]);
      resetter("");
    }
  };

  // Helper to remove strings
  const handleRemoveString = (value: string, setter: any, array: string[]) => {
    setter(array.filter(item => item !== value));
  };

  // Rating Handlers
  const handleAddRating = () => {
    const num = parseInt(newCustomerRating);
    if (!isNaN(num) && !customerRatings.includes(num)) {
      setCustomerRatings([...customerRatings, num].sort((a,b)=>b-a));
      setNewCustomerRating("");
    }
  };
  const handleRemoveRating = (rating: number) => {
    setCustomerRatings(customerRatings.filter(r => r !== rating));
  };

  // Price Range Handlers
  const handleAddPriceRange = () => {
    if (!newPriceLabel.trim()) return;
    const newRange: any = { label: newPriceLabel.trim() };
    if (newPriceMin) newRange.min = parseInt(newPriceMin);
    if (newPriceMax) newRange.max = parseInt(newPriceMax);
    
    setPriceRanges([...priceRanges, newRange]);
    setNewPriceLabel("");
    setNewPriceMin("");
    setNewPriceMax("");
  };
  const handleRemovePriceRange = (index: number) => {
    const newRanges = [...priceRanges];
    newRanges.splice(index, 1);
    setPriceRanges(newRanges);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Loading Filter Settings...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Filter Options</h1>
          <p className="text-sm text-neutral-500 mt-1">Changes made here will instantly reflect in the mobile app filter modal.</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="bg-rose-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-rose-600 disabled:opacity-50 transition shadow-sm"
        >
          {isSaving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* General Visibility Toggles Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Section Visibility Toggles</h2>
          <p className="text-xs text-neutral-500 mb-4">Turn on/off entire sections in the web Filter Modal.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showPriceFilter} onChange={(e) => setShowPriceFilter(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 accent-rose-500" />
              <span className="text-sm font-medium">Show Price Filter</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showRoomsFilter} onChange={(e) => setShowRoomsFilter(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 accent-rose-500" />
              <span className="text-sm font-medium">Show Rooms & Beds</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showPropertyTypeFilter} onChange={(e) => setShowPropertyTypeFilter(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 accent-rose-500" />
              <span className="text-sm font-medium">Show Property Types</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showCustomerRatingFilter} onChange={(e) => setShowCustomerRatingFilter(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 accent-rose-500" />
              <span className="text-sm font-medium">Show Customer Ratings</span>
            </label>
          </div>
        </div>

        {/* Booking Options Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Booking Options</h2>
          <div className="flex mb-3">
            <input 
              type="text" 
              value={newBookingOption}
              onChange={(e) => setNewBookingOption(e.target.value)}
              placeholder="E.g. Free cancellation"
              className="border border-neutral-300 rounded-l-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddString(newBookingOption, setBookingOptions, bookingOptions, setNewBookingOption)}
            />
            <button 
              onClick={() => handleAddString(newBookingOption, setBookingOptions, bookingOptions, setNewBookingOption)}
              className="bg-neutral-800 text-white px-3 py-1.5 rounded-r-md text-sm hover:bg-neutral-900 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {bookingOptions.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded border border-neutral-100">
                <span className="text-xs text-neutral-700">{item}</span>
                <button onClick={() => handleRemoveString(item, setBookingOptions, bookingOptions)} className="text-rose-500 text-xs font-bold px-2 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* House Rules Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-md font-bold mb-3 text-neutral-800">House Rules</h2>
          <div className="flex mb-3">
            <input 
              type="text" 
              value={newHouseRule}
              onChange={(e) => setNewHouseRule(e.target.value)}
              placeholder="E.g. Allows pets"
              className="border border-neutral-300 rounded-l-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddString(newHouseRule, setHouseRules, houseRules, setNewHouseRule)}
            />
            <button 
              onClick={() => handleAddString(newHouseRule, setHouseRules, houseRules, setNewHouseRule)}
              className="bg-neutral-800 text-white px-3 py-1.5 rounded-r-md text-sm hover:bg-neutral-900 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {houseRules.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded border border-neutral-100">
                <span className="text-xs text-neutral-700">{item}</span>
                <button onClick={() => handleRemoveString(item, setHouseRules, houseRules)} className="text-rose-500 text-xs font-bold px-2 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Redirection */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200 flex flex-col justify-center items-center text-center">
          <h2 className="text-md font-bold mb-2 text-neutral-800">Amenities Configuration</h2>
          <p className="text-xs text-neutral-500 mb-4">Amenities are now managed in their own dedicated, dynamic section.</p>
          <a href="/admin/amenities" className="bg-rose-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-rose-600 transition text-sm">
            Manage Amenities
          </a>
        </div>

        {/* Categories Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Left Menu Categories</h2>
          <div className="flex mb-3">
            <input 
              type="text" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="E.g. Star Rating"
              className="border border-neutral-300 rounded-l-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddString(newCategory, setCategories, categories, setNewCategory)}
            />
            <button 
              onClick={() => handleAddString(newCategory, setCategories, categories, setNewCategory)}
              className="bg-neutral-800 text-white px-3 py-1.5 rounded-r-md text-sm hover:bg-neutral-900 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {categories.map((item, index) => (
              <div key={index} className="flex items-center bg-neutral-100 rounded-full pl-3 pr-1 py-1 border border-neutral-200">
                <span className="text-xs text-neutral-700 font-medium">{item}</span>
                <button onClick={() => handleRemoveString(item, setCategories, categories)} className="ml-1 text-neutral-400 hover:text-rose-500 p-1">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sort Options Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Sort Options</h2>
          <div className="flex mb-3">
            <input 
              type="text" 
              value={newSortOption}
              onChange={(e) => setNewSortOption(e.target.value)}
              placeholder="E.g. Price: Highest first"
              className="border border-neutral-300 rounded-l-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddString(newSortOption, setSortOptions, sortOptions, setNewSortOption)}
            />
            <button 
              onClick={() => handleAddString(newSortOption, setSortOptions, sortOptions, setNewSortOption)}
              className="bg-neutral-800 text-white px-3 py-1.5 rounded-r-md text-sm hover:bg-neutral-900 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {sortOptions.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded border border-neutral-100">
                <span className="text-xs text-neutral-700">{item}</span>
                <button onClick={() => handleRemoveString(item, setSortOptions, sortOptions)} className="text-rose-500 text-xs font-bold px-2 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Ratings Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Customer Ratings (Stars)</h2>
          <div className="flex mb-3">
            <input 
              type="number" 
              value={newCustomerRating}
              onChange={(e) => setNewCustomerRating(e.target.value)}
              placeholder="E.g. 5"
              min="1" max="5"
              className="border border-neutral-300 rounded-l-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddRating()}
            />
            <button 
              onClick={handleAddRating}
              className="bg-neutral-800 text-white px-3 py-1.5 rounded-r-md text-sm hover:bg-neutral-900 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {customerRatings.map((rating, index) => (
              <div key={index} className="flex items-center bg-yellow-50 rounded-full pl-3 pr-1 py-1 border border-yellow-200">
                <span className="text-xs text-yellow-700 font-bold">{rating}+ Stars</span>
                <button onClick={() => handleRemoveRating(rating)} className="ml-1 text-yellow-500 hover:text-rose-500 p-1">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Property Types Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Property Types</h2>
          <div className="flex mb-3">
            <input 
              type="text" 
              value={newPropertyType}
              onChange={(e) => setNewPropertyType(e.target.value)}
              placeholder="E.g. Treehouse"
              className="border border-neutral-300 rounded-l-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddString(newPropertyType, setPropertyTypes, propertyTypes, setNewPropertyType)}
            />
            <button 
              onClick={() => handleAddString(newPropertyType, setPropertyTypes, propertyTypes, setNewPropertyType)}
              className="bg-neutral-800 text-white px-3 py-1.5 rounded-r-md text-sm hover:bg-neutral-900 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {propertyTypes.map((type, index) => (
              <div key={index} className="flex items-center bg-neutral-100 rounded-full pl-3 pr-1 py-1 border border-neutral-200">
                <span className="text-xs text-neutral-700 font-medium">{type}</span>
                <button onClick={() => handleRemoveString(type, setPropertyTypes, propertyTypes)} className="ml-1 text-neutral-400 hover:text-rose-500 p-1">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>



        {/* Price Ranges Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-neutral-200 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-md font-bold mb-3 text-neutral-800">Predefined Price Ranges</h2>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input 
              type="text" 
              value={newPriceLabel}
              onChange={(e) => setNewPriceLabel(e.target.value)}
              placeholder="Label (e.g. Any)"
              className="border border-neutral-300 rounded-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 col-span-2"
            />
            <input 
              type="number" 
              value={newPriceMin}
              onChange={(e) => setNewPriceMin(e.target.value)}
              placeholder="Min Price (optional)"
              className="border border-neutral-300 rounded-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <input 
              type="number" 
              value={newPriceMax}
              onChange={(e) => setNewPriceMax(e.target.value)}
              placeholder="Max Price (optional)"
              className="border border-neutral-300 rounded-md px-3 py-1.5 w-full text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <button 
            onClick={handleAddPriceRange}
            className="w-full bg-neutral-800 text-white px-3 py-2 rounded-md text-sm hover:bg-neutral-900 transition mb-4"
          >
            Add Price Range
          </button>
          
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {priceRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded border border-neutral-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-800">{range.label}</span>
                  <span className="text-[10px] text-neutral-500">
                    Min: {range.min !== undefined && range.min !== null ? range.min : 'None'} | 
                    Max: {range.max !== undefined && range.max !== null ? range.max : 'None'}
                  </span>
                </div>
                <button onClick={() => handleRemovePriceRange(index)} className="text-rose-500 text-xs font-bold px-2 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
