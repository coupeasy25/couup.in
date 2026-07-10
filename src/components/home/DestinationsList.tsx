'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Destination {
  _id: string;
  name: string;
  imageSrc: string;
}

interface DestinationsListProps {
  destinations: Destination[];
}

const DestinationsList: React.FC<DestinationsListProps> = ({ destinations }) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <div className=" pb-10 w-full">
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-neutral-900">
          Popular Destinations
        </h2>
        <div className="hidden md:flex flex-row gap-2">
          <button aria-label="Scroll left" suppressHydrationWarning onClick={() => scroll('left')} className="p-2 border-[1px] rounded-full hover:shadow-md transition bg-white text-neutral-600">
            <ChevronLeft size={16} />
          </button>
          <button aria-label="Scroll right" suppressHydrationWarning onClick={() => scroll('right')} className="p-2 border-[1px] rounded-full hover:shadow-md transition bg-white text-neutral-600">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="w-full flex justify-center">
        <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar w-max max-w-full">
          {destinations.map((destination) => (
            <div
              key={destination._id}
              onClick={() => router.push(`/?locationValue=${encodeURIComponent(destination.name)}`)}
              className="group cursor-pointer flex flex-col gap-2 min-w-[180px] max-w-[180px] sm:min-w-[200px] sm:max-w-[200px] snap-start shrink-0"
            >
            {/* Card Image */}
            <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image
                src={destination.imageSrc}
                alt={destination.name}
                fill
                sizes="(max-width: 748px) 50vw, 220px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>

              {/* Text Inside Card */}
              <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col items-start text-left">
                <span className="text-white font-medium text-xl drop-shadow-sm tracking-wide">
                  {destination.name}
                </span>
                <span className="text-white/80 text-[10px] font-medium uppercase tracking-widest mt-1">
                  INDIA
                </span>
              </div>
            </div>

            {/* Text Outside Card */}
            <div className="flex flex-row items-center justify-start gap-1 pl-1 text-neutral-500 group-hover:text-neutral-900 transition-colors">
              <span className="text-xs font-semibold">View Stays</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DestinationsList;
