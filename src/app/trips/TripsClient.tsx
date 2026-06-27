"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";

import { ChevronLeft } from "lucide-react";

interface TripsClientProps {
  reservations: any[];
  currentUser?: any | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    const reservation = reservations.find((r: any) => r.id === id);
    if (!reservation) return;

    let penalty = 0;
    const cancellationRules = reservation.listing?.cancellationRules || [];
    let applicableRule = null;
    
    if (cancellationRules.length === 0 && reservation.listing?.cancellationDays !== undefined) {
      cancellationRules.push({ days: reservation.listing.cancellationDays, deduction: reservation.listing.cancellationDeduction });
    }

    if (cancellationRules.length > 0) {
      const startDate = new Date(reservation.startDate);
      const today = new Date();
      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const sortedRules = [...cancellationRules].sort((a: any, b: any) => a.days - b.days);
      
      for (const rule of sortedRules) {
        if (diffDays <= rule.days) {
          applicableRule = rule;
          break;
        }
      }

      if (applicableRule) {
        penalty = (reservation.totalPrice * applicableRule.deduction) / 100;
      }
    }

    const message = penalty > 0 && applicableRule
      ? `Are you sure you want to cancel this booking? Since it is within ${applicableRule.days} days of check-in, a penalty of ₹${penalty} (${applicableRule.deduction}%) will be deducted. You will be refunded ₹${reservation.totalPrice - penalty}.`
      : `Are you sure you want to cancel this booking? You will receive a full refund.`;

    if (!window.confirm(message)) {
      return;
    }

    setDeletingId(id);

    axios.patch(`/api/reservations/${id}`, { status: 'Cancelled' })
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
    <Container>
      <div className="flex flex-row items-start gap-4 pt-10 mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2 mt-[-4px] rounded-full hover:bg-neutral-100 transition cursor-pointer">
          <ChevronLeft size={28} />
        </button>
        <div className="flex flex-col">
          <div className="text-2xl font-bold mb-1">Trips</div>
          <div className="font-light text-neutral-500">Where you've been and where you're going</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation: any) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id || reservation.status === 'Cancelled' || reservation.status === 'Checked-out'}
            actionLabel={reservation.status === 'Cancelled' ? 'Cancelled' : 'Cancel reservation'}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default TripsClient;
