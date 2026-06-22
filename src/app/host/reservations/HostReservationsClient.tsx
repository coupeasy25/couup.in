"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import ListingCard from "@/components/listings/ListingCard";
import ReservationDetailsModal from "@/components/modals/ReservationDetailsModal";

interface HostReservationsClientProps {
  reservations: any[];
  currentUser?: any | null;
}

const HostReservationsClient: React.FC<HostReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success('Reservation cancelled');
      router.refresh();
    })
    .catch((error) => {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    })
    .finally(() => {
      setDeletingId('');
    });
  }, [router]);

  return (
    <>
      <ReservationDetailsModal 
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        reservation={selectedReservation}
      />
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reservations on your properties</h2>
          <div className="font-light text-neutral-500">View and manage bookings made by guests. Click a card to view guest details.</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {reservations.map((reservation: any) => (
            <ListingCard
              key={reservation.id}
              data={reservation.listing}
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel}
              onViewDetails={(res) => setSelectedReservation(res)}
              disabled={deletingId === reservation.id}
              actionLabel="Cancel guest reservation"
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HostReservationsClient;
