"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, subDays } from "date-fns";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { CalendarClock, LogIn, LogOut, Users, TrendingUp, IndianRupee, Ban, X } from "lucide-react";

interface DashboardClientProps {
  listings: any[];
  allReservations: any[];
  currentUser: any;
}

const TABS = ["Overview", "Live Bookings", "Calendar View", "Guest Directory", "Property Management"];

const DashboardClient: React.FC<DashboardClientProps> = ({ listings, allReservations, currentUser }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  const listing = useMemo(() => listings.find(l => l.id === selectedListingId) || listings[0], [listings, selectedListingId]);
  const reservations = useMemo(() => allReservations.filter(r => r.listingId === listing?.id), [allReservations, listing?.id]);

  const [selectedStat, setSelectedStat] = useState<"checkIns" | "checkOuts" | "pending" | "active" | "cancelled" | null>(null);

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

  const modalReservations = useMemo(() => {
    if (!selectedStat) return [];
    const today = new Date();
    if (selectedStat === 'checkIns') return reservations.filter((r) => isSameDay(new Date(r.startDate), today) && r.status !== 'Cancelled');
    if (selectedStat === 'checkOuts') return reservations.filter((r) => isSameDay(new Date(r.endDate), today) && r.status !== 'Cancelled');
    if (selectedStat === 'pending') return reservations.filter((r) => r.status === 'Pending');
    if (selectedStat === 'active') return reservations.filter((r) => r.status === 'Checked-in');
    if (selectedStat === 'cancelled') return reservations.filter((r) => r.status === 'Cancelled');
    return [];
  }, [selectedStat, reservations]);

  const [analyticsPeriod, setAnalyticsPeriod] = useState<7 | 15 | 30>(7);

  const analyticsStats = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, analyticsPeriod);
    
    // We filter reservations created in this period, or if createdAt is missing, fallback to startDate
    const relevantReservations = reservations.filter(r => {
      const dateToCheck = r.createdAt ? new Date(r.createdAt) : new Date(r.startDate);
      return dateToCheck >= startDate && dateToCheck <= today;
    });
    
    const totalBookings = relevantReservations.length;
    const totalRevenue = relevantReservations.reduce((acc, r) => acc + (r.status !== 'Cancelled' ? r.totalPrice : 0), 0);
    const cancelled = relevantReservations.filter(r => r.status === 'Cancelled').length;

    return {
      totalBookings,
      totalRevenue,
      cancelled
    };
  }, [reservations, analyticsPeriod]);

  const uniqueGuests = useMemo(() => {
    const guestsMap = new Map();
    reservations.forEach(r => {
      if (r.status === 'Cancelled') return;
      
      const key = r.guestEmail || r.guestContact || r.userId || r.id;
      
      let guestName = "Guest";
      if (r.user?.name) {
        guestName = r.user.name;
      } else if (r.guests && r.guests.length > 0) {
        guestName = `${r.guests[0].firstName} ${r.guests[0].lastName}`.trim();
      }

      if (!guestsMap.has(key)) {
        guestsMap.set(key, {
          name: guestName,
          email: r.guestEmail || r.user?.email,
          phone: r.guestContact || r.user?.phone,
          totalBookings: 1,
          totalSpent: r.totalPrice,
          lastVisit: r.startDate,
          allReservations: [r]
        });
      } else {
        const existing = guestsMap.get(key);
        existing.totalBookings += 1;
        existing.totalSpent += r.totalPrice;
        existing.allReservations.push(r);
        if (new Date(r.startDate) > new Date(existing.lastVisit)) {
          existing.lastVisit = r.startDate;
        }
      }
    });
    return Array.from(guestsMap.values());
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
    title: listing?.title || "",
    description: listing?.description || "",
    price: listing?.price || 0,
    weekendPrice: listing?.weekendPrice || "",
    festivalPrice: listing?.festivalPrice || "",
    hasWelcomeOffer: listing?.hasWelcomeOffer || false,
    amenities: listing?.amenities || [],
    rooms: listing?.rooms || [],
  });

  const handleRoomPriceChange = (index: number, newPrice: number) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index] = { ...updatedRooms[index], price: newPrice };
    setFormData({ ...formData, rooms: updatedRooms });
  };

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
            const bookedCount = reservations.filter(r => r.status !== 'Cancelled' && day >= new Date(r.startDate) && day <= new Date(r.endDate)).length;
            const totalRooms = listing.rooms?.reduce((acc: number, room: any) => acc + (room.count || 1), 0) || 1;
            const isAllBooked = bookedCount >= totalRooms;
            
            let bgClass = "bg-neutral-50 hover:bg-neutral-100 cursor-pointer";
            if (isAllBooked) {
              bgClass = "bg-[#F97316]/20 text-[#F97316] font-bold cursor-not-allowed";
            } else if (bookedCount > 0) {
              bgClass = "bg-blue-50 text-blue-600 font-bold cursor-pointer hover:bg-blue-100";
            } else if (isBlocked) {
              bgClass = "bg-red-100 text-red-600 font-bold cursor-pointer border-red-200 border";
            }
            
            if (day.getMonth() !== currentMonth.getMonth()) {
              bgClass += " opacity-30";
            }

            return (
              <div 
                key={i} 
                onClick={() => !isAllBooked && handleDateToggle(day)}
                className={`p-4 rounded-xl flex flex-col items-center justify-center min-h-[80px] transition ${bgClass}`}
              >
                <span className="text-lg">{format(day, dateFormat)}</span>
                {isAllBooked && <span className="text-[10px] mt-1 uppercase tracking-wider text-center">All Booked</span>}
                {!isAllBooked && bookedCount > 0 && <span className="text-[10px] mt-1 uppercase tracking-wider text-center">{bookedCount} Booked</span>}
                {isBlocked && !isAllBooked && bookedCount === 0 && <span className="text-[10px] mt-1 uppercase tracking-wider text-center">Blocked</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!listing) {
    return (
      <Container>
        <div className="pt-24 pb-20 text-center text-neutral-500">
          You don't have any properties yet.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="pt-24 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Host Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-neutral-500">Managing:</span>
              <select 
                className="font-semibold text-black bg-neutral-100 border-none rounded-lg px-3 py-1 outline-none"
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
              >
                {listings.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            onClick={() => router.push(`/host/properties/${listing.id}/edit`)}
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
        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div 
                onClick={() => setSelectedStat("pending")}
                className="bg-white p-5 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors duration-200 group flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <div className="text-sm font-medium">Pending Bookings</div>
                  <CalendarClock size={16} className="group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-semibold text-black">{todayReservations.pending}</div>
              </div>

              <div 
                onClick={() => setSelectedStat("checkIns")}
                className="bg-white p-5 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors duration-200 group flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <div className="text-sm font-medium">Today's Check-ins</div>
                  <LogIn size={16} className="group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-semibold text-black">{todayReservations.checkIns}</div>
              </div>

              <div 
                onClick={() => setSelectedStat("checkOuts")}
                className="bg-white p-5 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors duration-200 group flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <div className="text-sm font-medium">Today's Check-outs</div>
                  <LogOut size={16} className="group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-semibold text-black">{todayReservations.checkOuts}</div>
              </div>

              <div 
                onClick={() => setSelectedStat("active")}
                className="bg-white p-5 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors duration-200 group flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <div className="text-sm font-medium">Active Guests</div>
                  <Users size={16} className="group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-semibold text-black">{todayReservations.active}</div>
              </div>

              <div 
                onClick={() => setSelectedStat("cancelled")}
                className="bg-white p-5 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors duration-200 group flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <div className="text-sm font-medium">Cancelled Bookings</div>
                  <Ban size={16} className="text-red-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div className="text-3xl font-semibold text-red-500">{analyticsStats.cancelled}</div>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-white rounded-3xl border border-neutral-200 mt-2">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-black">Performance Analytics</h2>
                </div>
                <select 
                  className="bg-white border border-neutral-200 rounded-lg px-4 py-2 outline-none font-medium text-sm text-black cursor-pointer hover:border-black transition-colors focus:ring-2 focus:ring-black focus:ring-offset-1 appearance-none"
                  value={analyticsPeriod}
                  onChange={(e) => setAnalyticsPeriod(Number(e.target.value) as 7 | 15 | 30)}
                  style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={15}>Last 15 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
              </div>
              
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-neutral-200 flex flex-col justify-between min-h-[120px]">
                  <div className="text-neutral-500 font-medium text-sm mb-2">Total Bookings</div>
                  <div className="text-3xl font-semibold text-black">{analyticsStats.totalBookings}</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-neutral-200 flex flex-col justify-between min-h-[120px]">
                  <div className="text-neutral-500 font-medium text-sm mb-2">Total Revenue</div>
                  <div className="text-3xl font-semibold text-green-600">₹{analyticsStats.totalRevenue.toLocaleString('en-IN')}</div>
                </div>

                <div 
                  onClick={() => setSelectedStat("cancelled")}
                  className="bg-white rounded-2xl p-6 border border-neutral-200 flex flex-col justify-between min-h-[120px] cursor-pointer hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <div className="text-sm font-medium">Cancellations</div>
                    <Ban size={16} className="text-red-400" />
                  </div>
                  <div className="text-3xl font-semibold text-red-500">{analyticsStats.cancelled}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stat Modal */}
        {selectedStat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold capitalize">
                  {selectedStat.replace(/([A-Z])/g, ' $1').trim()} ({modalReservations.length})
                </h3>
                <button onClick={() => setSelectedStat(null)} className="p-2 hover:bg-neutral-100 rounded-full transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-neutral-500"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {modalReservations.length === 0 ? (
                  <div className="text-center text-neutral-500 py-12 text-lg">No bookings found for this category.</div>
                ) : (
                  <div className="space-y-4">
                    {modalReservations.map(r => (
                      <div key={r.id} className="border border-neutral-200 p-5 rounded-2xl flex items-center justify-between hover:border-neutral-300 transition">
                        <div>
                          <div className="font-bold text-lg text-neutral-800">{r.guestName || "Guest"}</div>
                          <div className="text-neutral-500 mt-1">{r.guestPhone || r.guestEmail || "No contact info"}</div>
                          <div className="text-neutral-500 mt-1 flex items-center gap-2">
                            <span className="bg-neutral-100 px-2 py-1 rounded text-sm">{format(new Date(r.startDate), 'MMM d, yyyy')}</span>
                            <span>&rarr;</span>
                            <span className="bg-neutral-100 px-2 py-1 rounded text-sm">{format(new Date(r.endDate), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between h-full">
                          <div className="font-bold text-xl text-neutral-800">₹{r.totalPrice}</div>
                          <div className={`text-sm font-bold uppercase tracking-wider mt-3 px-3 py-1 rounded-full inline-block ${r.status === 'Pending' ? 'bg-[#F97316]/10 text-[#F97316]' : r.status === 'Checked-in' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {r.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

        {/* Guest Directory Tab */}
        {activeTab === "Guest Directory" && (
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-neutral-50/50">
              <div>
                <h2 className="text-xl font-bold">All Guests</h2>
                <p className="text-sm text-neutral-500 mt-1">Guests with confirmed or completed bookings</p>
              </div>
              <div className="bg-neutral-100 px-4 py-2 rounded-xl font-bold text-neutral-600">
                Total: {uniqueGuests.length}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b text-neutral-500 text-sm tracking-wider uppercase">
                    <th className="p-4 font-semibold">Guest Info</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold text-center">Total Bookings</th>
                    <th className="p-4 font-semibold">Total Spent</th>
                    <th className="p-4 font-semibold">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {uniqueGuests.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No guests found yet.</td></tr>
                  ) : uniqueGuests.map((g, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 transition cursor-pointer" onClick={() => setSelectedGuest(g)}>
                      <td className="p-4 font-bold text-black">{g.name}</td>
                      <td className="p-4">
                        <div className="text-sm font-semibold">{g.phone || "No phone"}</div>
                        <div className="text-sm text-neutral-500">{g.email || "No email"}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{g.totalBookings}</span>
                      </td>
                      <td className="p-4 font-bold text-green-600">₹{g.totalSpent.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-sm text-neutral-500 font-medium">{format(new Date(g.lastVisit), 'MMM d, yyyy')}</td>
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

            {formData.rooms && formData.rooms.length > 0 && (
              <>
                <h3 className="text-lg font-bold mt-8 mb-4">Room Specific Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                  {formData.rooms.map((room: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                      <div className="font-bold text-black mb-1">{room.type || `Room ${idx + 1}`}</div>
                      <div className="text-xs text-neutral-500 mb-3">Capacity: {room.capacity} guests • {room.count} rooms available</div>
                      <label className="text-sm font-semibold mb-2 block text-neutral-700">Price (Per Night)</label>
                      <Input 
                        type="number" 
                        value={room.price} 
                        onChange={e => handleRoomPriceChange(idx, parseInt(e.target.value) || 0)} 
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

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

      {/* Guest Details Modal Overlay */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-start bg-neutral-50/50">
              <div>
                <h2 className="text-2xl font-bold text-black">{selectedGuest.name}</h2>
                <div className="flex gap-4 mt-2 text-sm text-neutral-600">
                  <span className="flex items-center gap-1"><span className="font-semibold text-black">Phone:</span> {selectedGuest.phone || "N/A"}</span>
                  <span className="flex items-center gap-1"><span className="font-semibold text-black">Email:</span> {selectedGuest.email || "N/A"}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGuest(null)}
                className="p-2 hover:bg-neutral-200 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-neutral-50/30">
              <h3 className="font-bold text-lg mb-4 text-neutral-800">Booking History & Guests</h3>
              <div className="flex flex-col gap-6">
                {selectedGuest.allReservations.map((res: any, idx: number) => (
                  <div key={res.id || idx} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-100">
                      <div>
                        <div className="font-bold text-black text-lg">{res.listing?.title || "Property"}</div>
                        <div className="text-sm text-neutral-500 mt-1">
                          {format(new Date(res.startDate), 'MMM d, yyyy')} - {format(new Date(res.endDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#0f3d30]">₹{res.totalPrice?.toLocaleString('en-IN')}</div>
                        <div className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-md mt-1 inline-block">
                          {res.status || 'Confirmed'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-700 mb-3 uppercase tracking-wider">All Attending Guests ({res.guests?.length || 1})</h4>
                      {res.guests && res.guests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {res.guests.map((g: any, gIdx: number) => (
                            <div key={gIdx} className="flex items-center gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                              <div className="w-10 h-10 rounded-full bg-[#0f3d30]/10 flex items-center justify-center font-bold text-[#0f3d30]">
                                {g.firstName?.charAt(0)}{g.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-black">{g.firstName} {g.lastName}</div>
                                <div className="text-xs text-neutral-500">
                                  {g.gender} • Age: {g.age}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-500 italic">No secondary guests details provided.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DashboardClient;
