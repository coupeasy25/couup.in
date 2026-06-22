"use client";

import { useState } from "react";
import { updateFeaturedCities } from "@/actions/admin/settingsActions";
import { toast } from "react-hot-toast";

const CITIES = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Bharuch", "Vapi", "Porbandar", "Bhuj", "Gandhidham",
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Pali", "Sri Ganganagar", "Bharatpur", "Jaisalmer", "Mount Abu", "Pushkar"
].sort();

interface SettingsClientProps {
  initialFeaturedCities: string[];
}

const SettingsClient: React.FC<SettingsClientProps> = ({ initialFeaturedCities }) => {
  const [featuredCities, setFeaturedCities] = useState<string[]>(initialFeaturedCities);
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
    const result = await updateFeaturedCities(featuredCities);
    if (result?.success) {
      toast.success("Settings saved successfully!");
    } else {
      toast.error(result?.error || "Failed to save settings");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Featured Cities on Homepage</h2>
        <p className="text-neutral-500 text-sm">
          Select which cities should be featured on the main landing page. If no cities are selected, all cities will be shown.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2 border border-neutral-200 rounded-xl">
        {CITIES.map((city) => {
          const isSelected = featuredCities.includes(city);
          return (
            <div 
              key={city}
              onClick={() => toggleCity(city)}
              className={`p-3 border rounded-lg cursor-pointer transition flex items-center justify-between ${
                isSelected 
                  ? "bg-[#0f3d30]/5 border-[#0f3d30] text-[#0f3d30] font-medium shadow-sm" 
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
              }`}
            >
              <span>{city}</span>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#0f3d30] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-200">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="bg-[#0f3d30] text-[#D4AF37] px-8 py-3 rounded-xl font-bold hover:bg-[#0a2a21] transition disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default SettingsClient;
