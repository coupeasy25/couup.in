"use client";

import { useState } from "react";
import { 
  Wifi, Tv, Wind, Car, Waves, Utensils, Coffee, 
  Dumbbell, Snowflake, Flame, Shield, Monitor, 
  Check, Shirt, ParkingCircle, Refrigerator, Fan,
  FireExtinguisher, Cross, Briefcase, Key
} from "lucide-react";

interface ListingAmenitiesProps {
  amenities?: string[];
  standoutAmenities?: string[];
  safetyItems?: string[];
}

const getAmenityIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('wifi') || lowerName.includes('internet')) return <Wifi size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('tv') || lowerName.includes('television')) return <Tv size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('air conditioning') || lowerName.includes('ac') || lowerName.includes('cool')) return <Snowflake size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('heating') || lowerName.includes('heater') || lowerName.includes('fire')) return <Flame size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('parking') || lowerName.includes('garage') || lowerName.includes('car')) return <Car size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('pool') || lowerName.includes('hot tub') || lowerName.includes('water')) return <Waves size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('kitchen') || lowerName.includes('cooking') || lowerName.includes('dining')) return <Utensils size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('espresso')) return <Coffee size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('workout')) return <Dumbbell size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('work') || lowerName.includes('office') || lowerName.includes('desk')) return <Briefcase size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('washer') || lowerName.includes('washing') || lowerName.includes('laundry')) return <Shirt size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('fridge') || lowerName.includes('refrigerator')) return <Refrigerator size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('fan')) return <Fan size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('extinguisher')) return <FireExtinguisher size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('first aid') || lowerName.includes('medical')) return <Cross size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('key') || lowerName.includes('lock')) return <Key size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('safe') || lowerName.includes('security') || lowerName.includes('alarm')) return <Shield size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  if (lowerName.includes('monitor') || lowerName.includes('screen')) return <Monitor size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
  
  // Default icon
  return <Check size={24} strokeWidth={1.5} className="text-neutral-700 shrink-0" />;
};

const ListingAmenities: React.FC<ListingAmenitiesProps> = ({
  amenities = [],
  standoutAmenities = [],
  safetyItems = []
}) => {
  const allAmenities = [...amenities, ...standoutAmenities, ...safetyItems];
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  return (
    <>
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="h-16 flex items-center px-6 border-b-[1px] border-neutral-200 sticky top-0 bg-white z-10">
              <button 
                onClick={() => setShowAmenitiesModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible' }}>
                  <path d="m6 6 20 20"></path><path d="m26 6-20 20"></path>
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-3xl font-semibold mb-8">What this place offers</h2>
              <div className="flex flex-col gap-6">
                {allAmenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-neutral-800 text-lg font-light py-4 border-b-[1px] border-neutral-100 last:border-none">
                    {getAmenityIcon(item)}
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-3">What this place offers</h2>
        {allAmenities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4 text-[16px] text-neutral-700 font-light">
            {allAmenities.slice(0, 9).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {getAmenityIcon(item)}
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 font-light">No amenities listed.</div>
        )}
        {allAmenities.length > 9 && (
          <div 
            onClick={() => setShowAmenitiesModal(true)}
            className="mt-6 border-[1px] border-black rounded-lg px-6 py-3 font-semibold text-black w-max cursor-pointer hover:bg-neutral-100 transition"
          >
            Show all {allAmenities.length} amenities
          </div>
        )}
      </div>
    </>
  );
};

export default ListingAmenities;
