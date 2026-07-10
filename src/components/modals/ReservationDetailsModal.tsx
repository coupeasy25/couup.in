"use client";

import Modal from "./Modal";
import { format } from "date-fns";

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  isOpen,
  onClose,
  reservation
}) => {
  if (!reservation) return null;

  const { listing, guests, gstState, basePrice, taxes, totalPrice, startDate, endDate, roomType, createdAt } = reservation;

  const bodyContent = (
    <div className="flex flex-col gap-6">
      {/* Listing Info */}
      <div className="flex flex-col gap-2 p-4 bg-neutral-50 rounded-xl border-[1px] border-neutral-200">
        <h3 className="font-bold text-lg">{listing?.title}</h3>
        <p className="text-sm text-neutral-500">{listing?.locationValue}</p>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          {reservation.isHourlyBooking ? (
            <>
              <div>
                <span className="font-semibold block">Date:</span>
                {format(new Date(startDate), 'PP')}
              </div>
              <div>
                <span className="font-semibold block">Time Slot:</span>
                {reservation.checkInTime} ({reservation.hourlyDuration} hours)
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-semibold block">Check In:</span>
                {format(new Date(startDate), 'PP')}
              </div>
              <div>
                <span className="font-semibold block">Check Out:</span>
                {format(new Date(endDate), 'PP')}
              </div>
            </>
          )}
          <div>
            <span className="font-semibold block">Room Type:</span>
            {roomType || 'Entire Property'}
          </div>
          <div>
            <span className="font-semibold block">Booked On:</span>
            {format(new Date(createdAt), 'PP')}
          </div>
        </div>
      </div>

      {/* Guest Details */}
      <div>
        <h3 className="font-bold text-lg mb-3">Guest Details ({guests?.length || 1})</h3>
        {guests && guests.length > 0 ? (
          <div className="flex flex-col gap-3">
            {guests.map((guest: any, index: number) => (
              <div key={index} className="p-3 border-[1px] border-neutral-200 rounded-lg flex justify-between text-sm">
                <div>
                  <span className="font-semibold">{guest.firstName} {guest.lastName}</span>
                </div>
                <div className="text-neutral-500 text-right">
                  {guest.gender}, Age {guest.age}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-neutral-500 italic">No detailed guest information provided.</div>
        )}
      </div>

      {/* Payment Details */}
      <div>
        <h3 className="font-bold text-lg mb-3">Payment Summary</h3>
        <div className="p-4 bg-neutral-50 rounded-xl border-[1px] border-neutral-200 text-sm flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">{reservation.isHourlyBooking ? 'Base Price (Hourly):' : 'Base Price:'}</span>
            <span>₹{(basePrice || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Taxes (GST {gstState ? `- ${gstState}` : ''}):</span>
            <span>₹{(taxes || 0).toLocaleString('en-IN')}</span>
          </div>
          <hr className="my-2 border-neutral-200" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid:</span>
            <span>₹{(totalPrice || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose}
      title="Reservation Details"
      actionLabel="Close"
      body={bodyContent}
    />
  );
};

export default ReservationDetailsModal;
