"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInCalendarDays, isPast, isToday } from "date-fns";
import { ChevronLeft, MapPin, Calendar, Users, IndianRupee, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

import Container from "@/components/Container";

interface TripDetailsClientProps {
  reservation: any;
  currentUser?: any | null;
}

const TripDetailsClient: React.FC<TripDetailsClientProps> = ({
  reservation,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  const nights = differenceInCalendarDays(endDate, startDate) || 1;
  const isCancelled = reservation.status === 'Cancelled';
  
  // A trip is upcoming if it's not cancelled and the end date is in the future
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
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 pt-24">
      <Container>
        
        {/* Header */}
        <div className="flex flex-row items-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/trips')} 
            className="p-2 rounded-full hover:bg-neutral-200 bg-white shadow-sm border border-neutral-200 transition cursor-pointer"
          >
            <ChevronLeft size={24} className="text-neutral-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-neutral-800">Trip Details</h1>
            <div className="text-sm font-medium text-neutral-500">
              Trip ID: {reservation.id.toUpperCase()}
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
              isCancelled 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : isCompleted 
                  ? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  : 'bg-green-50 text-green-600 border-green-200'
            }`}>
              {isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : 'Confirmed'}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Property Box */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-neutral-200 p-6 flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <Image 
                  fill 
                  src={reservation.listing.imageSrc[0]} 
                  alt="Property" 
                  className="object-cover" 
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold text-neutral-800 mb-1">{reservation.listing.title}</h2>
                <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-medium mb-3">
                  <MapPin size={16} className="text-[#F97316]" />
                  {reservation.listing.locationValue}
                </div>
                <button 
                  onClick={() => router.push(`/listings/${reservation.listing.id}`)}
                  className="text-sm font-semibold text-[#F97316] hover:underline self-start"
                >
                  View Property Listing
                </button>
              </div>
            </div>

            {/* Stay Details */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-neutral-200 p-6">
              <h3 className="text-lg font-bold mb-6 text-neutral-800 flex items-center gap-2">
                <Calendar size={20} className="text-[#F97316]" />
                Stay Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Check-In</div>
                  <div className="text-lg font-semibold text-neutral-800">{format(startDate, 'EEEE, dd MMM yyyy')}</div>
                  <div className="text-sm text-neutral-500 font-medium mt-1">{reservation.listing.checkInTime || '2:00 PM'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Check-Out</div>
                  <div className="text-lg font-semibold text-neutral-800">{format(endDate, 'EEEE, dd MMM yyyy')}</div>
                  <div className="text-sm text-neutral-500 font-medium mt-1">{reservation.listing.checkOutTime || '11:00 AM'}</div>
                </div>
              </div>
              
              <hr className="my-6 border-neutral-100" />
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Duration</span>
                  <span className="text-base font-semibold text-neutral-700">{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Room Type</span>
                  <span className="text-base font-semibold text-neutral-700">{reservation.roomType || 'Standard'} ({reservation.roomsCount || 1} Room{(reservation.roomsCount || 1) > 1 ? 's' : ''})</span>
                </div>
              </div>
            </div>

            {/* Guests Box */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-neutral-200 p-6">
              <h3 className="text-lg font-bold mb-6 text-neutral-800 flex items-center gap-2">
                <Users size={20} className="text-[#F97316]" />
                Guest Details
              </h3>
              
              <div className="flex flex-col gap-4">
                {reservation.guests && reservation.guests.length > 0 ? (
                  reservation.guests.map((guest: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-800 text-sm">
                          {guest.firstName} {guest.lastName}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium mt-0.5">
                          {idx === 0 ? 'Primary Guest' : `Guest ${idx + 1}`}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-neutral-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-neutral-100">
                        {guest.gender} • {guest.age} yrs
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-500 text-sm">No guest details provided.</div>
                )}
              </div>
            </div>
            
          </div>

          {/* Right Column (Payment & Actions) */}
          <div className="w-full lg:w-[360px] flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-neutral-200 p-6 sticky top-28">
              <h3 className="text-lg font-bold mb-6 text-neutral-800 flex items-center gap-2">
                <IndianRupee size={20} className="text-[#F97316]" />
                Payment Summary
              </h3>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-sm font-medium text-neutral-600">
                  <span>Base Price</span>
                  <span>₹{reservation.basePrice?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-neutral-600">
                  <span>Taxes & Fees</span>
                  <span>₹{reservation.taxes?.toLocaleString('en-IN') || 0}</span>
                </div>
                
                {reservation.couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <span>Coupon Applied</span>
                    <span>-₹{reservation.couponDiscount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="h-[1px] w-full bg-neutral-200 mb-6" />

              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-bold text-neutral-800">Total Paid</span>
                <span className="text-2xl font-bold text-[#F97316]">
                  ₹{reservation.totalPrice?.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="text-[11px] text-neutral-400 font-medium text-right mb-6 uppercase tracking-wider">
                Paid via {reservation.paymentMethod || 'Razorpay'}
              </div>

              {isUpcoming && (
                <div className="flex flex-col gap-3">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 mb-2">
                    <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-xs font-medium text-amber-800 leading-relaxed">
                      Cancellation policies apply. Review the property's policy before cancelling.
                    </span>
                  </div>
                  
                  <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Cancel Booking'}
                  </button>
                </div>
              )}
            </div>

          </div>
          
        </div>
      </Container>
    </div>
  );
};

export default TripDetailsClient;
