"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Calendar, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import useBookingSuccessModal from "@/hooks/useBookingSuccessModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const BookingSuccessModal = () => {
  const router = useRouter();
  const bookingSuccessModal = useBookingSuccessModal();
  const { bookingDetails } = bookingSuccessModal;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleClose = () => {
    bookingSuccessModal.onClose();
    router.push("/trips");
  };

  if (!bookingDetails) return null;

  return (
    <Dialog open={bookingSuccessModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] p-8 overflow-hidden bg-white border border-neutral-200 shadow-2xl rounded-3xl" showCloseButton={false}>
        
        <div className="flex flex-col items-center">
          
          <div className="w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <Check size={32} className="text-[#F97316] stroke-[2.5]" />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center tracking-tight">
            Booking Confirmed
          </h2>
          <p className="text-neutral-500 text-center mb-8 text-sm">
            You're all set! A confirmation email has been sent to you.
          </p>

          <div className="w-full border border-neutral-200 rounded-2xl p-5 flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Property</span>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F97316] mt-0.5" />
                <span className="text-base font-semibold text-neutral-800 leading-tight">{bookingDetails.listingTitle}</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-neutral-100" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Check In</span>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#F97316]" />
                  <span className="text-sm font-medium text-neutral-800">
                    {format(new Date(bookingDetails.startDate), 'MMM dd')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Check Out</span>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#F97316]" />
                  <span className="text-sm font-medium text-neutral-800">
                    {format(new Date(bookingDetails.endDate), 'MMM dd')}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-neutral-100" />

            <div className="flex flex-row justify-between items-end w-full">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Guests</span>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#F97316]" />
                  <span className="text-sm font-medium text-neutral-800">
                    {bookingDetails.guests?.length || 1} Guests
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 items-end">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Paid</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-neutral-900">
                    ₹{bookingDetails.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="mt-8 w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-4 rounded-xl font-semibold text-[15px] transition-all"
          >
            View Your Trips
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccessModal;

