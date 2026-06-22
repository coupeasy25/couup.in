"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import Modal from "@/components/modals/Modal";

interface RecentReservationsClientProps {
  reservations: any[];
}

export default function RecentReservationsClient({ reservations }: RecentReservationsClientProps) {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  if (reservations.length === 0) {
    return (
      <div className="p-6 bg-white border border-neutral-200 rounded-xl text-neutral-500">
        No recent reservations found.
      </div>
    );
  }

  const handleCloseModal = () => {
    setSelectedReservation(null);
  };

  const bodyContent = selectedReservation ? (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-neutral-800">Guest Details</h3>
        <div className="flex flex-col gap-1 text-neutral-600">
          <p><strong>Name:</strong> {selectedReservation.user?.name || "Guest"}</p>
          <p className="break-all"><strong>Email:</strong> {selectedReservation.user?.email || "N/A"}</p>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-neutral-800">Property Details</h3>
        <div className="flex flex-col gap-1 text-neutral-600">
          <p><strong>Property:</strong> {selectedReservation.listing.title}</p>
          <p><strong>Location:</strong> {selectedReservation.listing.locationValue}</p>
        </div>
        <div className="w-full h-40 relative rounded-md overflow-hidden bg-neutral-200 mt-2">
          {selectedReservation.listing.imageSrc?.[0] && (
            <Image
              src={selectedReservation.listing.imageSrc[0]}
              alt="Listing"
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-neutral-800">Booking Details</h3>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 text-neutral-600">
          <p><strong>Check-in:</strong> {format(new Date(selectedReservation.startDate), 'PP')}</p>
          <p><strong>Check-out:</strong> {format(new Date(selectedReservation.endDate), 'PP')}</p>
          <p><strong>Total Price:</strong> ₹{selectedReservation.totalPrice}</p>
          <p><strong>Created:</strong> {format(new Date(selectedReservation.createdAt), 'PP')}</p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-neutral-100 text-neutral-600">
            <tr>
              <th className="p-4 font-semibold">Guest</th>
              <th className="p-4 font-semibold">Property</th>
              <th className="p-4 font-semibold">Check-in</th>
              <th className="p-4 font-semibold">Check-out</th>
              <th className="p-4 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {reservations.slice(0, 5).map((reservation: any) => (
              <tr 
                key={reservation.id} 
                className="hover:bg-neutral-50 cursor-pointer transition-colors"
                onClick={() => setSelectedReservation(reservation)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {reservation.user?.image ? (
                      <Image src={reservation.user.image} alt="Guest" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold">
                        {reservation.user?.name?.charAt(0) || "G"}
                      </div>
                    )}
                    <span className="font-medium">{reservation.user?.email || reservation.user?.name || "Guest"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-md overflow-hidden bg-neutral-200">
                      {reservation.listing.imageSrc[0] && (
                        <Image
                          src={reservation.listing.imageSrc[0]}
                          alt="Listing"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{reservation.listing.title}</span>
                  </div>
                </td>
                <td className="p-4">{format(new Date(reservation.startDate), 'PP')}</td>
                <td className="p-4">{format(new Date(reservation.endDate), 'PP')}</td>
                <td className="p-4 font-semibold">₹{reservation.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedReservation}
        onClose={handleCloseModal}
        onSubmit={handleCloseModal}
        actionLabel="Close"
        title="Reservation Details"
        body={bodyContent as any}
      />
    </>
  );
}
