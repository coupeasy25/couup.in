"use client";

import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface FavoritesClientProps {
  listings: any[];
  currentUser?: any | null;
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  
  return (
    <Container>
      <div className="flex flex-row items-start gap-4 pt-28 mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2 mt-[-4px] rounded-full hover:bg-neutral-100 transition cursor-pointer">
          <ChevronLeft size={28} />
        </button>
        <div className="flex flex-col">
          <div className="text-2xl font-bold mb-1">Favorites</div>
          <div className="font-light text-neutral-500">Listings you have favorited</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing: any) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
