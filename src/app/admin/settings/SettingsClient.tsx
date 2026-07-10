"use client";

import { useState } from "react";
import { updateFeaturedCities, updateFeeSettings } from "@/actions/admin/settingsActions";
import { toast } from "react-hot-toast";

const CITIES = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Bharuch", "Vapi", "Porbandar", "Bhuj", "Gandhidham",
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Pali", "Sri Ganganagar", "Bharatpur", "Jaisalmer", "Mount Abu", "Pushkar"
].sort();

interface SettingsClientProps {
  initialFeaturedCities: string[];
  initialCouupFeePercentage: number;
  initialGstPercentage: number;
}

const SettingsClient: React.FC<SettingsClientProps> = ({ 
  initialFeaturedCities,
  initialCouupFeePercentage,
  initialGstPercentage
}) => {
  const [featuredCities, setFeaturedCities] = useState<string[]>(initialFeaturedCities);
  const [couupFeePercentage, setCouupFeePercentage] = useState(initialCouupFeePercentage);
  const [gstPercentage, setGstPercentage] = useState(initialGstPercentage);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCity = (city: string) => {
    if (featuredCities.includes(city)) {
      setFeaturedCities((prev) => prev.filter((c) => c !== city));
    } else {
      setFeaturedCities((prev) => [...prev, city]);
    }
  };

  const onSave = async () => {
    setIsLoading(true);
    const result1 = await updateFeaturedCities(featuredCities);
    const result2 = await updateFeeSettings(couupFeePercentage, gstPercentage);
    
    if (result1?.success && result2?.success) {
      toast.success("Settings saved successfully!");
    } else {
      toast.error("Failed to save some settings");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Featured Cities Section */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">Featured Cities on Homepage</h2>
          <p className="text-neutral-500 text-sm max-w-2xl">
            Select which cities should be featured on the main landing page. Only the cities you select here will be displayed as carousels.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto p-4 -mx-4 border-y border-neutral-100 bg-neutral-50/50 rounded-xl custom-scrollbar">
          {CITIES.map((city) => {
            const isSelected = featuredCities.includes(city);
            return (
              <div 
                key={city}
                onClick={() => toggleCity(city)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between border-2 ${
                  isSelected 
                    ? "bg-white border-[#F97316] text-[#F97316] shadow-sm shadow-orange-100 scale-[1.02]" 
                    : "bg-white border-transparent hover:border-neutral-200 text-neutral-600 hover:shadow-sm"
                }`}
              >
                <span className={`font-medium text-sm ${isSelected ? 'text-[#F97316]' : 'text-neutral-600'}`}>{city}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#F97316] to-[#fb923c] flex items-center justify-center shadow-sm">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fee & Tax Section */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">Fee & Tax Configuration</h2>
          <p className="text-neutral-500 text-sm max-w-2xl">
            Set the platform service fee percentage and GST percentage that will be automatically applied to all bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3 group-focus-within:text-[#F97316] transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <span className="text-[#F97316] font-bold">%</span>
              </div>
              Couup Service Fee
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={couupFeePercentage}
                onChange={(e) => setCouupFeePercentage(Number(e.target.value))}
                className="w-full p-4 pl-5 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 transition-all text-lg font-medium text-neutral-800 bg-neutral-50/50"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">%</div>
            </div>
          </div>
          
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3 group-focus-within:text-[#F97316] transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <span className="text-[#F97316] font-bold text-xs">GST</span>
              </div>
              GST Percentage
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={gstPercentage}
                onChange={(e) => setGstPercentage(Number(e.target.value))}
                className="w-full p-4 pl-5 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 transition-all text-lg font-medium text-neutral-800 bg-neutral-50/50"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="relative overflow-hidden bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-10 py-4 rounded-full font-bold shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <span>Save All Settings</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsClient;
