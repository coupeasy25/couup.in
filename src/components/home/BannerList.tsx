"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Banner {
  _id: string;
  imageSrc: string;
  title?: string;
  isActive: boolean;
}

interface BannerListProps {
  banners: Banner[];
}

const BannerList: React.FC<BannerListProps> = ({ banners }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % banners.length;
        const clientWidth = scrollRef.current.clientWidth;

        // Use smooth scrolling to the next index
        scrollRef.current.scrollTo({
          left: nextIndex * clientWidth,
          behavior: 'smooth'
        });
        setActiveIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeIndex, banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden snap-x snap-mandatory w-full h-full"
      >
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="relative flex-none w-full h-full snap-center overflow-hidden"
          >
            <Image
              src={banner.imageSrc}
              alt={banner.title || "Banner"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-16 w-full flex justify-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            suppressHydrationWarning
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? "w-6 bg-[#F97316]" : "bg-white/50 hover:bg-white/80"
              }`}
            onClick={() => {
              setActiveIndex(index);
              if (scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: index * scrollRef.current.clientWidth,
                  behavior: 'smooth'
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerList;
