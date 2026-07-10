'use client';

import Container from "@/components/Container";
import Image from "next/image";
import { IOffer } from "@/models/Offer";

interface PromotionalOffersProps {
  offers: any[]; // Using any[] to accommodate JSON parsed Mongoose documents
}

export default function PromotionalOffers({ offers }: PromotionalOffersProps) {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <div className="w-full  py-8 bg-white">
      <div className="px-4 md:px-8 max-w-[1350px] mx-auto">

        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">
            Best Offers For You
          </h2>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar scroll-smooth">
          {offers.map((offer) => {
            const hasText = (offer.title && offer.title !== "Untitled Offer") || offer.subTitle || offer.description || offer.logo;

            return (
              <div
                key={offer._id || offer.id}
                className={`min-w-[320px] max-w-[320px] h-[190px] flex-shrink-0 ${offer.bgColor} ${offer.border || ''} rounded-2xl p-5 relative overflow-hidden snap-start hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-sm`}
              >

                {/* Image Only (Full Width Banner) */}
                <div className="absolute inset-0 z-0">
                  {offer.image && (
                    <Image
                      src={offer.image}
                      alt="Promotional Offer"
                      fill
                      className="object-cover object-center"
                    />
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
