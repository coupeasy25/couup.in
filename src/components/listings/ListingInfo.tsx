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
  return (
    <div className="col-span-4 flex flex-col gap-8 pb-10">

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

    </div>
  );
};

export default ListingInfo;
