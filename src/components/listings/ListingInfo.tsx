"use client";

import Avatar from "../Avatar";
import { BedDouble, Wifi, Tv, Wind, Car, Waves, Utensils, Key, Medal, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ListingInfoProps {
  user: any;
  description: string;
  title?: string;
  propertyType?: string;
  peoplePerRoom?: number;
  bathroomType?: string;
  amenities?: string[];
  standoutAmenities?: string[];
  safetyItems?: string[];
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  title,
  propertyType = 'Entire home',
  peoplePerRoom = 1,
  bathroomType = 'Private',
  amenities = [],
  standoutAmenities = [],
  safetyItems = []
}) => {
  const allAmenities = [...amenities, ...standoutAmenities, ...safetyItems];

  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  return (
    <div className="col-span-4 flex flex-col gap-8 pb-10">

      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
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
            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <h2 className="text-3xl font-semibold mb-8">What this place offers</h2>
              <div className="flex flex-col gap-6">
                {allAmenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-neutral-800 text-lg font-light py-2 border-b-[1px] border-neutral-100 last:border-none">
                    <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="text-2xl font-semibold">
          {title}
        </div>
        <div className="flex flex-row items-center gap-2 text-[15px] font-light text-neutral-800">
          <div>Up to {peoplePerRoom} guests per room</div>
        </div>
      </div>



      {/* Host Profile Header */}
      <div 
        onClick={() => window.location.href = `/users/${user?.id || user?._id}`}
        className="flex flex-row items-center gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-neutral-50 cursor-pointer transition border border-transparent hover:border-neutral-200"
      >
        <Avatar src={user?.image} />
        <div className="flex flex-col">
          <div className="font-semibold text-base">Hosted by {user?.name || 'Host'}</div>
          <div className="font-light text-neutral-500 text-sm">Click to view profile</div>
        </div>
      </div>

      <hr className="border-neutral-200" />



      {/* Description */}
      <div className="text-[16px] leading-relaxed font-light text-neutral-800">
        {description}
        <br/><br/>
        Relax with the whole family at this peaceful place to stay. Featuring modern amenities and a beautiful view, this home is perfectly situated for your vacation.
        <div className="font-semibold underline mt-4 cursor-pointer flex items-center gap-1">Show more</div>
      </div>

      <hr className="border-neutral-200" />



      {/* Amenities */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
        {allAmenities.length > 0 ? (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[16px] text-neutral-700 font-light">
            {allAmenities.slice(0, 8).map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-neutral-500 font-light">No amenities listed.</div>
        )}
        {allAmenities.length > 8 && (
          <div 
            onClick={() => setShowAmenitiesModal(true)}
            className="mt-6 border-[1px] border-black rounded-lg px-6 py-3 font-semibold text-black w-max cursor-pointer hover:bg-neutral-100 transition"
          >
            Show all {allAmenities.length} amenities
          </div>
        )}
      </div>

    </div>
  );
};

export default ListingInfo;
