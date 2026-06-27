"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";

interface DashboardClientProps {
  listing: any;
  reservations: any[];
  currentUser: any;
}

const TABS = ["Overview", "Live Bookings", "Calendar View", "Property Management"];

const DashboardClient: React.FC<DashboardClientProps> = ({ listing, reservations, currentUser }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(false);

  // === STATS ===
  const todayReservations = useMemo(() => {
    const today = new Date();
    return {
      checkIns: reservations.filter((r) => isSameDay(new Date(r.startDate), today) && r.status !== 'Cancelled').length,
      checkOuts: reservations.filter((r) => isSameDay(new Date(r.endDate), today) && r.status !== 'Cancelled').length,
      pending: reservations.filter((r) => r.status === 'Pending').length,
      active: reservations.filter((r) => r.status === 'Checked-in').length,
    };
  }, [reservations]);

  // === RESERVATION ACTIONS ===
  const onUpdateReservationStatus = useCallback(async (id: string, status: string) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/reservations/${id}`, { status });
      toast.success(`Booking marked as ${status}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // === PROPERTY ACTIONS ===
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    weekendPrice: listing.weekendPrice || "",
    festivalPrice: listing.festivalPrice || "",
    hasWelcomeOffer: listing.hasWelcomeOffer || false,
    amenities: listing.amenities || [],
  });

  const onUpdateProperty = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/listings/${listing.id}`, formData);
      toast.success("Property updated!");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data || "Failed to update property.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, listing.id, router]);

  // === CALENDAR LOGIC ===
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const handleDateToggle = useCallback(async (date: Date) => {
    const currentBlocked = listing.blockedDates || [];
    const dateStr = date.toISOString();
    
    // Check if already blocked
    const isBlocked = currentBlocked.some((bd: string) => isSameDay(new Date(bd), date));
    
    let newBlockedDates;
    if (isBlocked) {
      // Unblock
      newBlockedDates = currentBlocked.filter((bd: string) => !isSameDay(new Date(bd), date));
    } else {
      // Block
      newBlockedDates = [...currentBlocked, dateStr];
    }
    
    setIsLoading(true);
    try {
      await axios.patch(`/api/listings/${listing.id}`, { blockedDates: newBlockedDates });
      toast.success(isBlocked ? "Date unblocked" : "Date blocked");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to update calendar");
    } finally {
      setIsLoading(false);
    }
  }, [listing.id, listing.blockedDates, router]);

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-4 py-2 border rounded-xl hover:bg-neutral-50">&larr; Prev</button>
          <h3 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h3>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-4 py-2 border rounded-xl hover:bg-neutral-50">Next &rarr;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-neutral-500 text-sm">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            const isBlocked = (listing.blockedDates || []).some((bd: string) => isSameDay(new Date(bd), day));
            // Check if there is an active reservation
            const hasBooking = reservations.some(r => r.status !== 'Cancelled' && day >= new Date(r.startDate) && day <= new Date(r.endDate));
            
            let bgClass = "bg-neutral-50 hover:bg-neutral-100 cursor-pointer";
            if (hasBooking) bgClass = "bg-[#F97316]/20 text-[#F97316] font-bold cursor-not-allowed";
            else if (isBlocked) bgClass = "bg-red-100 text-red-600 font-bold cursor-pointer border-red-200 border";
            
            if (day.getMonth() !== currentMonth.getMonth()) {
              bgClass += " opacity-30";
            }

            return (
              <div 
                key={i} 
                onClick={() => !hasBooking && handleDateToggle(day)}
                className={`p-4 rounded-xl flex flex-col items-center justify-center min-h-[80px] transition ${bgClass}`}
              >
                <span className="text-lg">{format(day, dateFormat)}</span>
                {hasBooking && <span className="text-[10px] mt-1 uppercase tracking-wider">Booked</span>}
                {isBlocked && !hasBooking && <span className="text-[10px] mt-1 uppercase tracking-wider">Blocked</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Container>
      <div className="pt-24 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Host Dashboard</h1>
            <p className="text-neutral-500 mt-2">Managing: <span className="font-semibold text-black">{listing.title}</span></p>
          </div>
          <button 
            onClick={() => router.push(`/properties/${listing.id}/edit`)}
            className="px-6 py-2 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition font-semibold"
          >
            Full Edit Mode
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-8 border-b pb-4 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full font-semibold transition whitespace-nowrap ${activeTab === tab ? "bg-[#F97316] text-white" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
              <div className="text-neutral-500 font-semibold mb-2">Pending Bookings</div>
              <div className="text-4xl font-bold text-[#F97316]">{todayReservations.pending}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
              <div className="text-neutral-500 font-semibold mb-2">Today's Check-ins</div>
              <div className="text-4xl font-bold">{todayReservations.checkIns}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
              <div className="text-neutral-500 font-semibold mb-2">Today's Check-outs</div>
              <div className="text-4xl font-bold">{todayReservations.checkOuts}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
              <div className="text-neutral-500 font-semibold mb-2">Active Guests</div>
              <div className="text-4xl font-bold text-green-600">{todayReservations.active}</div>
            </div>
          </div>
        )}

        {/* Live Bookings Tab */}
        {activeTab === "Live Bookings" && (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b text-neutral-500 text-sm tracking-wider uppercase">
                    <th className="p-4 font-semibold">Guest</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Dates</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No bookings found</td></tr>
                  ) : reservations.map(r => (
                    <tr key={r.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4">
                        <div className="font-semibold">{r.user?.name || "Guest"}</div>
                        <div className="text-xs text-neutral-500">{r.roomsCount} room(s) - {r.roomType || 'Any'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{r.guestContact || r.user?.phone || 'N/A'}</div>
                        <div className="text-xs text-neutral-500">{r.guestEmail || r.user?.email || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{format(new Date(r.startDate), 'dd MMM yyyy')}</div>
                        <div className="text-xs text-neutral-500">to {format(new Date(r.endDate), 'dd MMM yyyy')}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          r.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                          r.status === 'Checked-in' ? 'bg-green-100 text-green-700' :
                          r.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {r.status || 'Confirmed'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {(r.status === 'Pending' || !r.status) && (
                            <>
                              <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Confirmed')} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Accept</button>
                              <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Cancelled')} className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200">Reject</button>
                            </>
                          )}
                          {r.status === 'Confirmed' && (
                            <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Checked-in')} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Check In</button>
                          )}
                          {r.status === 'Checked-in' && (
                            <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Checked-out')} className="px-3 py-1 bg-neutral-800 text-white rounded-lg text-sm font-semibold hover:bg-neutral-900">Check Out</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar View Tab */}
        {activeTab === "Calendar View" && renderCalendar()}

        {/* Property Management Tab */}
        {activeTab === "Property Management" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Quick Price Adjustments</h2>
            
            <div className="flex flex-col gap-6 mb-8">
              <div>
                <label className="text-sm font-semibold mb-2 block">Property Description</label>
                <textarea 
                  className="w-full border rounded-xl p-3 min-h-[100px]" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your property..."
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Base Price (Per Night)</label>
                <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Weekend Price (Optional)</label>
                <Input type="number" placeholder="Override price for weekends" value={formData.weekendPrice} onChange={e => setFormData({...formData, weekendPrice: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Festival / Holiday Price (Optional)</label>
                <Input type="number" placeholder="Override price during festivals" value={formData.festivalPrice} onChange={e => setFormData({...formData, festivalPrice: e.target.value})} />
              </div>
            </div>

            <hr className="mb-8" />

            <h2 className="text-xl font-bold mb-6">Offers & Promotions</h2>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 mb-8">
              <div>
                <div className="font-bold text-green-800">Welcome Offer (₹500 OFF)</div>
                <div className="text-sm text-green-600">Give new users ₹500 off on their booking.</div>
              </div>
              <button 
                onClick={() => setFormData({...formData, hasWelcomeOffer: !formData.hasWelcomeOffer})}
                className={`w-14 h-8 rounded-full transition-colors relative ${formData.hasWelcomeOffer ? 'bg-green-500' : 'bg-neutral-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${formData.hasWelcomeOffer ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <button
              disabled={isLoading}
              onClick={onUpdateProperty}
              className="w-full bg-[#F97316] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#EA580C] transition"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

      </div>
    </Container>
  );
};

export default DashboardClient;
