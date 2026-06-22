"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface SeeAllCardProps {
  locationName: string;
  images: string[];
}

const SeeAllCard: React.FC<SeeAllCardProps> = ({ locationName, images }) => {
  const router = useRouter();

  // Ensure we have at least 3 images for the collage by repeating if necessary
  const displayImages = [...images];
  while (displayImages.length < 3) {
    if (images.length > 0) {
      displayImages.push(images[0]);
    } else {
      displayImages.push("/images/placeholder.jpg");
    }
  }

  return (
    <div
      onClick={() => router.push(`/?locationValue=${locationName}`)}
      className="col-span-1 cursor-pointer group w-full"
    >
      <div className="flex flex-col gap-2 w-full">
        {/* Top Image Container (Matches ListingCard aspect-[4/3]) */}
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition duration-300">

          {/* Collage Container */}
          <div className="relative w-full h-full flex items-center justify-center scale-90">

            {/* Back Left Image */}
            <div className="absolute w-[50%] aspect-[4/3] rounded-xl overflow-hidden shadow-sm -translate-x-6 -translate-y-4 -rotate-12 border-4 border-white z-10 transition duration-300 group-hover:-rotate-[15deg] group-hover:-translate-x-8">
              <Image src={displayImages[0]} alt="Listing" fill className="object-cover" />
            </div>

            {/* Back Right Image */}
            <div className="absolute w-[50%] aspect-[4/3] rounded-xl overflow-hidden shadow-sm translate-x-6 -translate-y-4 rotate-12 border-4 border-white z-10 transition duration-300 group-hover:rotate-[15deg] group-hover:translate-x-8">
              <Image src={displayImages[1]} alt="Listing" fill className="object-cover" />
            </div>

            {/* Front Center Image */}
            <div className="absolute w-[60%] aspect-[4/3] rounded-xl overflow-hidden shadow-md translate-y-4 border-4 border-white z-20 transition duration-300 group-hover:scale-110">
              <Image src={displayImages[2]} alt="Listing" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Text Container (Matches ListingCard text block) */}
        <div className="flex flex-col mt-1">
          <div className="font-semibold text-[15px] underline underline-offset-2">
            See all in {locationName}
          </div>
          <div className="font-light text-neutral-500 text-[15px]">
            Explore all properties
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeAllCard;
