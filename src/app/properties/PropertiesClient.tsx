"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";

import { ChevronLeft } from "lucide-react";

interface PropertiesClientProps {
  listings: any[];
  currentUser?: any | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/listings/${id}`)
    .then(() => {
      toast.success('Listing deleted');
      router.refresh();
    })
    .catch((error) => {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    })
    .finally(() => {
      setDeletingId('');
    });
  }, [router]);

  const onEdit = useCallback((id: string) => {
    router.push(`/properties/${id}/edit`);
  }, [router]);

  const onDashboard = useCallback((id: string) => {
    router.push(`/properties/${id}/dashboard`);
  }, [router]);

  return (
    <Container>
      <div className="flex flex-row items-start gap-4 pt-10 mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2 mt-[-4px] rounded-full hover:bg-neutral-100 transition cursor-pointer">
          <ChevronLeft size={28} />
        </button>
        <div className="flex flex-col">
          <div className="text-2xl font-bold mb-1">Properties</div>
          <div className="font-light text-neutral-500">List of your properties</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDashboard}
            actionLabel="Host Dashboard"
            disabled={deletingId === listing.id}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default PropertiesClient;
