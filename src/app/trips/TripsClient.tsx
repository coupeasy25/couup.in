"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { format, isPast, isToday } from "date-fns";

import Container from "@/components/Container";
import { MoreVertical } from "lucide-react";
import TripDetailsModal from "@/components/modals/TripDetailsModal";

interface TripsClientProps {
  reservations: any[];
  currentUser?: any | null;
  invoices?: any[];
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
  invoices = []
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [deletingId, setDeletingId] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const upcomingReservations = useMemo(() => {
    return reservations.filter(res => {
      const isCompleted = isPast(new Date(res.endDate)) && !isToday(new Date(res.endDate));
      return !isCompleted && res.status !== 'Cancelled';
    });
  }, [reservations]);

  const completedReservations = useMemo(() => {
    return reservations.filter(res => {
      const isCompleted = isPast(new Date(res.endDate)) && !isToday(new Date(res.endDate));
      return isCompleted || res.status === 'Cancelled';
    });
  }, [reservations]);

  const displayedReservations = activeTab === 'upcoming' ? upcomingReservations : completedReservations;

  const onCancel = useCallback((id: string) => {
    setOpenMenuId(null);
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
  }, [reservations, router]);

  return (
    <>
      <TripDetailsModal 
        isOpen={!!selectedReservation} 
        onClose={() => setSelectedReservation(null)} 
        reservation={selectedReservation} 
        onCancelSuccess={() => {
          setSelectedReservation(null);
          router.refresh();
        }}
      />
      <div className="min-h-screen bg-neutral-50 pb-20 pt-24">
        <Container>
          <div className="mb-8">
            <div className="text-3xl font-light text-neutral-500 mb-6">My Trips</div>
            
            <div className="flex gap-8 border-b border-neutral-200">
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`pb-3 text-[15px] font-medium transition-all relative ${activeTab === 'upcoming' ? 'text-[#F97316]' : 'text-neutral-500 hover:text-neutral-800'}`}
              >
                Upcoming
                {activeTab === 'upcoming' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F97316]" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`pb-3 text-[15px] font-medium transition-all relative ${activeTab === 'completed' ? 'text-[#F97316]' : 'text-neutral-500 hover:text-neutral-800'}`}
              >
                Completed
                {activeTab === 'completed' && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F97316]" />
                )}
              </button>
            </div>
          </div>

          {displayedReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-neutral-200 p-12 text-center text-neutral-500">
              No {activeTab} trips found.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-neutral-200 overflow-visible relative">
              {displayedReservations.map((reservation: any, index: number) => {
                const startDate = new Date(reservation.startDate);
                const isLast = index === displayedReservations.length - 1;
                const isCancelled = reservation.status === 'Cancelled';
                
                // Calculate nights
                const nights = Math.max(1, Math.ceil((new Date(reservation.endDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
                
                return (
                  <div 
                    key={reservation.id} 
                    onClick={() => setSelectedReservation(reservation)}
                    className={`flex flex-col md:flex-row items-center py-6 px-6 ${!isLast ? 'border-b border-neutral-200' : ''} hover:bg-neutral-50 transition-colors cursor-pointer group`}
                  >
                    
                    {/* Column 1: Date block */}
                    <div className="w-full md:w-40 shrink-0 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200 pb-4 md:pb-0 md:pr-6 mb-4 md:mb-0">
                      <div className={`text-4xl font-bold leading-none transition-colors ${isCancelled ? 'text-neutral-400' : 'text-[#F97316] group-hover:text-[#EA580C]'}`}>
                        {format(startDate, 'dd')}
                      </div>
                      <div className="text-xs text-neutral-500 font-medium uppercase mt-1 tracking-wider">
                        {format(startDate, 'MMM yyyy')}
                      </div>
                      <div className="text-sm font-bold text-neutral-800 mt-0.5">
                        {format(startDate, 'EEEE')}
                      </div>
                    </div>
                    
                    {/* Column 2: Property details */}
                    <div className="w-full md:flex-1 md:px-8 flex flex-col justify-center mb-4 md:mb-0 text-center md:text-left">
                      <div className={`text-[17px] font-bold ${isCancelled ? 'text-neutral-500 line-through' : 'text-neutral-700 group-hover:text-[#F97316] transition-colors'}`}>
                        {reservation.listing?.title}
                      </div>
                      <div className="text-sm font-medium text-neutral-400 mt-1 uppercase tracking-wider">
                        {reservation.listing?.locationValue || 'Location'}
                      </div>
                    </div>
                    
                    {/* Column 3: Boarding / Duration Details */}
                    <div className="w-full md:w-48 shrink-0 flex flex-col justify-center mb-4 md:mb-0 text-center md:text-left">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                        Check-In
                      </div>
                      <div className="text-sm text-neutral-600 font-medium">
                        {reservation.listing?.checkInTime || '2:00 PM'}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                        {nights} Night{nights > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {/* Column 4: Status and Action */}
                    <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end text-right relative">
                      <div className="flex flex-col items-start md:items-end">
                        <div className={`text-sm font-bold ${isCancelled ? 'text-red-500' : activeTab === 'completed' ? 'text-neutral-800' : 'text-green-600'}`}>
                          {isCancelled ? 'Cancelled' : activeTab === 'completed' ? 'Completed' : 'Confirmed'}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1 font-medium">
                          Trip ID: {reservation.id.slice(-10).toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="relative" ref={openMenuId === reservation.id ? menuRef : null}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === reservation.id ? null : reservation.id);
                          }}
                          className="p-1 hover:bg-neutral-200 rounded-full transition ml-4 text-neutral-400"
                          disabled={deletingId === reservation.id}
                        >
                          <MoreVertical size={22} />
                        </button>
                        
                        {openMenuId === reservation.id && (
                          <div className="absolute right-0 top-10 w-40 bg-white border border-neutral-200 shadow-lg rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                            {activeTab === 'upcoming' && !isCancelled && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCancel(reservation.id);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                              >
                                {deletingId === reservation.id ? 'Cancelling...' : 'Cancel Booking'}
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/listings/${reservation.listing?.id}`);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 font-medium transition-colors"
                            >
                              View Property
                            </button>
                            
                            {invoices.find((inv: any) => inv.reservationId === reservation.id) && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const inv = invoices.find((inv: any) => inv.reservationId === reservation.id);
                                  window.open(`/invoice/${inv._id}`, '_blank');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 font-medium transition-colors border-t border-neutral-100"
                              >
                                View Invoice
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default TripsClient;
