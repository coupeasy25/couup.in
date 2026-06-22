"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import ListingCard from "./ListingCard";
import SeeAllCard from "./SeeAllCard";

interface ListingCarouselProps {
  title: string;
  locationName: string;
  listings: any[];
  currentUser?: any | null;
}

const ListingCarousel: React.FC<ListingCarouselProps> = ({ title, locationName, listings, currentUser }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  if (listings.length === 0) return null;

  const displayListings = listings.slice(0, 6);
  
  // Extract 3 images for the collage, preferring the "other" hotels (index 6 onwards)
  let collageImages: string[] = [];
  const remainingListings = listings.slice(6);
  if (remainingListings.length >= 3) {
    collageImages = remainingListings.slice(0, 3).map(l => l.imageSrc?.[0] || '/images/placeholder.jpg');
  } else {
    // Fallback to the last 3 hotels in the entire list
    collageImages = listings.slice(-3).map(l => l.imageSrc?.[0] || '/images/placeholder.jpg');
  }

  return (
    <div className="flex flex-col mb-12">
      <div className="flex flex-row items-center justify-between mb-4 px-4 md:px-0">
        <h2 
          onClick={() => router.push(`/?locationValue=${locationName}`)}
          className="text-2xl font-bold flex items-center gap-2 cursor-pointer hover:underline"
        >
          {title} <ChevronRight size={20} className="mt-1" />
        </h2>
        <div className="hidden md:flex flex-row gap-2">
          <button suppressHydrationWarning onClick={() => scroll('left')} className="p-2 border-[1px] rounded-full hover:shadow-md transition bg-white text-neutral-600">
            <ChevronLeft size={16} />
          </button>
          <button suppressHydrationWarning onClick={() => scroll('right')} className="p-2 border-[1px] rounded-full hover:shadow-md transition bg-white text-neutral-600">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
        `}} />
        
        {displayListings.map((listing) => (
          <div key={listing.id} className="min-w-[75vw] sm:min-w-[260px] md:min-w-[240px] lg:min-w-[220px] xl:min-w-[250px] snap-start">
            <ListingCard
              currentUser={currentUser}
              data={listing}
            />
          </div>
        ))}

        {/* See All Card appended at the end */}
        <div className="min-w-[75vw] sm:min-w-[260px] md:min-w-[240px] lg:min-w-[220px] xl:min-w-[250px] snap-start flex items-stretch">
          <SeeAllCard locationName={locationName} images={collageImages} />
        </div>

      </div>
    </div>
  );
}

export default ListingCarousel;
