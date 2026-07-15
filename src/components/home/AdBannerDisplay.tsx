"use client";

import Image from "next/image";

interface AdBannerProps {
  banners: any[];
}

const AdBannerDisplay: React.FC<AdBannerProps> = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  // For now, just display the first active ad banner. 
  // Later we could randomize this or rotate them.
  const banner = banners[0];

  const content = (
    <div className="w-full max-w-4xl mx-auto relative overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60 shadow-sm flex items-center justify-center">
      {/* Aspect ratio container - makes it thinner as requested */}
      <div className="w-full aspect-[4/1] sm:aspect-[6/1] md:aspect-[8/1] lg:aspect-[10/1] max-h-[100px] relative">
        <Image
          src={banner.imageSrc}
          alt="Advertisement"
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase z-10">
          Ad
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full my-4">
      {banner.link ? (
        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default AdBannerDisplay;
