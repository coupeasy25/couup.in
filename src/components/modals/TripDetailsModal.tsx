"use client";

import Image from "next/image";
import { format, differenceInCalendarDays, isPast, isToday } from "date-fns";
import { MapPin, Calendar, Users, IndianRupee, AlertCircle, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any | null;
  onCancelSuccess: () => void;
}

const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onCancelSuccess
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!reservation) return null;

  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  const nights = Math.max(1, differenceInCalendarDays(endDate, startDate));
  const isCancelled = reservation.status === 'Cancelled';
  
  const isCompleted = isPast(endDate) && !isToday(endDate);
  const isUpcoming = !isCompleted && !isCancelled;

  const onCancel = async () => {
    let penalty = 0;
    const cancellationRules = reservation.listing?.cancellationRules || [];
    let applicableRule = null;
    
    if (cancellationRules.length === 0 && reservation.listing?.cancellationDays !== undefined) {
      cancellationRules.push({ days: reservation.listing.cancellationDays, deduction: reservation.listing.cancellationDeduction });
    }

    if (cancellationRules.length > 0) {
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

    setIsLoading(true);

    try {
      await axios.patch(`/api/reservations/${reservation.id}`, { status: 'Cancelled' });
      toast.success('Reservation cancelled');
      onCancelSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white shadow-2xl rounded-3xl" showCloseButton={true}>
        
        {/* Header */}
        <div className="bg-white px-8 pt-8 pb-4 flex justify-between items-end relative">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Trip Details</h1>
            <div className="text-sm font-medium text-neutral-400 mt-1">
              Trip ID: {reservation.id.toUpperCase()}
            </div>
          </div>
          <div className="mr-6 mb-1">
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
              isCancelled 
                ? 'bg-red-50 text-red-600 border-red-100' 
                : isCompleted 
                  ? 'bg-neutral-50 text-neutral-600 border-neutral-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : 'Confirmed'}
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 pt-2 max-h-[75vh] overflow-y-auto">
          
          <div className="w-full h-[1px] bg-neutral-100 mb-8" />

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column (Main Info) */}
            <div className="flex-1 flex flex-col gap-10">
              
              {/* Property Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative w-full sm:w-44 h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-neutral-100">
                  <Image 
                    fill 
                    src={reservation.listing?.imageSrc?.[0] || '/placeholder.jpg'} 
                    alt="Property" 
                    className="object-cover" 
                  />
                </div>
                <div className="flex flex-col justify-center py-1">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2 leading-tight">{reservation.listing?.title}</h2>
                  <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-medium mb-4">
                    <MapPin size={16} className="text-neutral-400" />
                    {reservation.listing?.locationValue}
                  </div>
                  <button 
                    onClick={() => {
                      onClose();
                      router.push(`/listings/${reservation.listing?.id}`);
                    }}
                    className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors self-start"
                  >
                    View Property Listing
                  </button>
                </div>
              </div>

              <div className="w-full h-[1px] bg-neutral-100" />

              {/* Stay Details */}
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Calendar size={18} className="text-neutral-400" />
                  Stay Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Check-In</span>
                    <span className="text-lg font-semibold text-neutral-900">{format(startDate, 'EEE, dd MMM yyyy')}</span>
                    <span className="text-sm text-neutral-500 font-medium">{reservation.listing?.checkInTime || '2:00 PM'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Check-Out</span>
                    <span className="text-lg font-semibold text-neutral-900">{format(endDate, 'EEE, dd MMM yyyy')}</span>
                    <span className="text-sm text-neutral-500 font-medium">{reservation.listing?.checkOutTime || '11:00 AM'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 bg-neutral-50 p-4 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Duration</span>
                    <span className="text-sm font-semibold text-neutral-700">{nights} Night{nights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-0.5">Room Type</span>
                    <span className="text-sm font-semibold text-neutral-700">{reservation.roomType || 'Standard'} ({reservation.roomsCount || 1} Room{(reservation.roomsCount || 1) > 1 ? 's' : ''})</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-neutral-100" />

              {/* Guests Section */}
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Users size={18} className="text-neutral-400" />
                  Guest Details
                </h3>
                
                <div className="flex flex-col">
                  {reservation.guests && reservation.guests.length > 0 ? (
                    reservation.guests.map((guest: any, idx: number) => (
                      <div key={idx} className={`flex justify-between items-center py-4 ${idx !== reservation.guests.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-neutral-900 text-sm">
                            {guest.firstName} {guest.lastName}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">
                            {idx === 0 ? 'Primary Guest' : `Guest ${idx + 1}`}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                          {guest.gender} • {guest.age} yrs
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-500 text-sm italic">No guest details provided.</div>
                  )}
                </div>
              </div>
              
            </div>

            {/* Right Column (Payment & Actions) */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6">
              
              <div className="sticky top-0 bg-neutral-50/50 border border-neutral-100 rounded-3xl p-7">
                <h3 className="text-lg font-bold mb-6 text-neutral-900 flex items-center gap-2">
                  <IndianRupee size={18} className="text-neutral-400" />
                  Payment Summary
                </h3>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-between items-center text-sm text-neutral-600">
                    <span>Base Price</span>
                    <span className="font-medium text-neutral-900">₹{reservation.basePrice?.toLocaleString('en-IN') || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-neutral-600">
                    <span>Taxes & Fees</span>
                    <span className="font-medium text-neutral-900">₹{reservation.taxes?.toLocaleString('en-IN') || 0}</span>
                  </div>
                  
                  {reservation.couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm font-semibold text-emerald-600">
                      <span>Coupon Applied</span>
                      <span>-₹{reservation.couponDiscount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="w-full h-[1px] border-t border-dashed border-neutral-300 mb-6" />

                <div className="flex justify-between items-end mb-2">
                  <span className="text-base font-bold text-neutral-900">Total Paid</span>
                  <span className="text-3xl font-bold text-[#F97316] leading-none tracking-tight">
                    ₹{reservation.totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="text-xs text-neutral-400 font-medium text-right mb-8">
                  Paid via {reservation.paymentMethod || 'Razorpay'}
                </div>

                {isUpcoming && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-neutral-400 mt-0.5 shrink-0" />
                      <span className="text-xs font-medium text-neutral-500 leading-relaxed">
                        Cancellation policies apply. Review the property's policy before cancelling.
                      </span>
                    </div>
                    
                    <button
                      onClick={onCancel}
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-white border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Cancel Booking'}
                    </button>
                  </div>
                )}
              </div>

            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsModal;
