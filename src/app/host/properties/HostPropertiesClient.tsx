"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import ListingCard from "@/components/listings/ListingCard";

interface HostPropertiesClientProps {
  listings: any[];
  currentUser?: any | null;
}

const HostPropertiesClient: React.FC<HostPropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/listings/${id}`)
    .then(() => {
      toast.success('Property deleted');
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
    router.push(`/host/properties/${id}/edit`);
  }, [router]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Properties</h2>
        <div className="font-light text-neutral-500">Manage your listings</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            onEdit={onEdit}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default HostPropertiesClient;
