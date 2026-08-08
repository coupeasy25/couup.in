'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Destination {
  _id: string;
  name: string;
  imageSrc: string;
}

interface DestinationsGridProps {
  destinations: Destination[];
}

const DestinationsGrid: React.FC<DestinationsGridProps> = ({ destinations }) => {
  const router = useRouter();

  if (!destinations || destinations.length === 0) {
    return null;
  }

  const featured = destinations.slice(0, 5);
  const rest = destinations.slice(5, 10);

  const getSpanClass = (index: number) => {
    if (index === 0) return "md:col-span-2 md:row-span-2 min-h-[260px] md:min-h-0";
    return "min-h-[200px] md:min-h-0";
  };

  const DestinationCard = ({
    destination,
    spanClass,
    priority = false,
  }: {
    destination: Destination;
    spanClass: string;
    priority?: boolean;
  }) => (
    <div
      onClick={() => router.push(`/?locationValue=${encodeURIComponent(destination.name)}`)}
      className={`relative w-full h-full ${spanClass} rounded-2xl overflow-hidden cursor-pointer shadow-md`}
    >
      <Image
        src={destination.imageSrc}
        alt={destination.name}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col">
        <span className="text-white font-bold text-xl md:text-2xl drop-shadow-md">
          {destination.name}
        </span>
        <span className="text-white/85 text-xs md:text-sm font-medium mt-1 drop-shadow-md">
          Explore stays in {destination.name}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full py-8 bg-white">
      <div className="px-4 md:px-8 max-w-[1350px] mx-auto">
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            Popular Destinations
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            We have selected some best locations around the world for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[520px]">
          {featured.map((destination, index) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
              spanClass={getSpanClass(index)}
              priority={index === 0}
            />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {rest.map((destination) => (
              <DestinationCard
                key={destination._id}
                destination={destination}
                spanClass="min-h-[200px] md:min-h-[220px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsGrid;
