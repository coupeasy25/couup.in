'use client';

import Container from "@/components/Container";
import Image from "next/image";
import { IOffer } from "@/models/Offer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

interface PromotionalOffersProps {
  offers: any[]; // Using any[] to accommodate JSON parsed Mongoose documents
}

export default function PromotionalOffers({ offers }: PromotionalOffersProps) {
  const { scrollRef, events } = useDraggableScroll();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      if (direction === 'left') {
        scrollRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
      }
    }
  };

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
          <div className="flex flex-row gap-2">
            <button aria-label="Scroll left" suppressHydrationWarning onClick={() => scroll('left')} className="p-2 border-[1px] rounded-full hover:shadow-md transition bg-white text-neutral-600">
              <ChevronLeft size={16} />
            </button>
            <button aria-label="Scroll right" suppressHydrationWarning onClick={() => scroll('right')} className="p-2 border-[1px] rounded-full hover:shadow-md transition bg-white text-neutral-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef} 
          {...events}
          className="flex flex-nowrap gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 snap-x scroll-smooth hide-scrollbar touch-pan-x cursor-grab active:cursor-grabbing"
        >
          {offers.map((offer) => {
            const hasText = (offer.title && offer.title !== "Untitled Offer") || offer.subTitle || offer.description || offer.logo;

            return (
              <div
                key={offer._id || offer.id}
                className={`min-w-[320px] max-w-[320px] h-[190px] flex-shrink-0 ${offer.bgColor} ${offer.border || ''} rounded-2xl p-5 relative overflow-hidden snap-start cursor-pointer shadow-sm`}
              >

                {/* Image Only (Full Width Banner) */}
                <div className="absolute inset-0 z-0">
                  {offer.image && (
                    <Image
                      src={offer.image}
                      alt="Promotional Offer"
                      fill
                      draggable={false}
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
