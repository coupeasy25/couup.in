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
