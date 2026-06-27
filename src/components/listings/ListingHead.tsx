"use client";

import Image from "next/image";
import { Share, Heart, LayoutGrid, X, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  images: string[];
  id: string;
  currentUser?: any | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  images,
  id,
  currentUser
}) => {
  const [showGallery, setShowGallery] = useState(false);

  // Ensure we have 5 images to fill the grid, fallback to placeholders if needed
  const displayImages = [...images];
  while (displayImages.length < 5) {
    if (images.length > 0) {
      displayImages.push(images[0]);
    } else {
      displayImages.push("/images/placeholder.jpg");
    }
  }

  if (showGallery) {
    return (
      <div className="fixed inset-0 z-[1000] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="h-20 w-full flex items-center justify-between px-6 md:px-10 border-b-[1px] border-neutral-200 sticky top-0 bg-white z-10">
          <button
            onClick={() => setShowGallery(false)}
            className="p-2 hover:bg-neutral-100 rounded-full transition flex items-center gap-2"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-4">
            <div className="flex flex-row items-center gap-2 cursor-pointer hover:bg-neutral-100 p-2 rounded-lg transition font-semibold text-sm underline decoration-1 underline-offset-4">
              <Share size={16} />
              <span className="hidden md:block">Share</span>
            </div>
            <div className="flex flex-row items-center gap-2 cursor-pointer hover:bg-neutral-100 p-2 rounded-lg transition font-semibold text-sm underline decoration-1 underline-offset-4">
              <Heart size={16} />
              <span className="hidden md:block">Save</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto w-full pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-8">
            {images.map((src, index) => (
              <div key={index} className={`w-full relative aspect-[3/2] overflow-hidden rounded-xl bg-neutral-100 ${index % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : ''}`}>
                <Image
                  alt={`Image ${index + 1}`}
                  src={src}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-end justify-between mt-6 mb-4">
        <div className="text-start">
          <div className="text-3xl font-semibold text-neutral-800">{title}</div>
        </div>
        <div className="flex flex-row items-center gap-6 font-semibold text-sm text-neutral-800 underline decoration-1 underline-offset-4">
          <div className="flex flex-row items-center gap-2 cursor-pointer hover:text-black transition">
            <Share size={16} />
            <span>Share</span>
          </div>
          <div className="flex flex-row items-center gap-2 cursor-pointer hover:text-black transition">
            <Heart size={16} />
            <span>Save</span>
          </div>
        </div>
      </div>

      {/* 5-Image Grid */}
      <div className="w-full h-[60vh] max-h-[500px] overflow-hidden rounded-2xl relative flex flex-row gap-2">
        {/* Large Left Image */}
        <div
          onClick={() => setShowGallery(true)}
          className="w-1/2 h-full relative cursor-pointer hover:opacity-90 transition group"
        >
          <Image
            alt={`${title} - Main Image`}
            src={displayImages[0]}
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full transition duration-500"
          />
        </div>

        {/* Small 2x2 Right Grid */}
        <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-2">
          <div onClick={() => setShowGallery(true)} className="relative h-full w-full cursor-pointer hover:opacity-90 transition group overflow-hidden">
            <Image alt="Image 2" src={displayImages[1]} fill className="object-cover transition duration-500" />
          </div>
          <div onClick={() => setShowGallery(true)} className="relative h-full w-full cursor-pointer hover:opacity-90 transition group overflow-hidden">
            <Image alt="Image 3" src={displayImages[2]} fill className="object-cover transition duration-500" />
          </div>
          <div onClick={() => setShowGallery(true)} className="relative h-full w-full cursor-pointer hover:opacity-90 transition group overflow-hidden">
            <Image alt="Image 4" src={displayImages[3]} fill className="object-cover transition duration-500" />
          </div>
          <div onClick={() => setShowGallery(true)} className="relative h-full w-full cursor-pointer hover:opacity-90 transition group overflow-hidden">
            <Image alt="Image 5" src={displayImages[4]} fill className="object-cover transition duration-500" />
          </div>
        </div>

        {/* Show all photos button */}
        <button
          onClick={() => setShowGallery(true)}
          className="absolute bottom-6 right-6 bg-white border-[1px] border-black px-4 py-1.5 rounded-lg text-sm font-semibold flex flex-row items-center gap-2 hover:bg-neutral-100 transition shadow-sm z-10"
        >
          <LayoutGrid size={16} />
          Show all photos
        </button>
      </div>
    </>
  );
};

export default ListingHead;
