"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, subDays, startOfYear } from "date-fns";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { CalendarClock, LogIn, LogOut, Users, Ban, X, Download, Star, ExternalLink, ChevronDown, Printer, Activity, IndianRupee, MessageSquare, Settings2 } from "lucide-react";

interface DashboardClientProps {
  listings: any[];
  allReservations: any[];
  allReviews?: any[];
  currentUser: any;
}

const TABS = ["Overview", "Live Bookings", "Calendar View", "Guest Directory", "Reviews", "Property Management"];

const DashboardClient: React.FC<DashboardClientProps> = ({ listings, allReservations, allReviews = [], currentUser }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null); // For detailed booking/PDF
  
  const [reviewForm, setReviewForm] = useState({ guestId: '', customName: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const listing = useMemo(() => listings.find(l => l.id === selectedListingId) || listings[0], [listings, selectedListingId]);
  const reservations = useMemo(() => allReservations.filter(r => r.listingId === listing?.id), [allReservations, listing?.id]);
  const reviews = useMemo(() => allReviews.filter(r => r.listingId === listing?.id), [allReviews, listing?.id]);

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

  const [analyticsPeriod, setAnalyticsPeriod] = useState<"thisMonth" | "lastMonth" | "thisYear" | "allTime" | 7 | 15 | 30>("thisMonth");

  const analyticsStats = useMemo(() => {
    const today = new Date();
    let startDate = new Date();
    
    if (analyticsPeriod === 7) startDate = subDays(today, 7);
    else if (analyticsPeriod === 15) startDate = subDays(today, 15);
    else if (analyticsPeriod === 30) startDate = subDays(today, 30);
    else if (analyticsPeriod === "thisMonth") startDate = startOfMonth(today);
    else if (analyticsPeriod === "lastMonth") startDate = startOfMonth(subMonths(today, 1));
    else if (analyticsPeriod === "thisYear") startDate = startOfYear(today);
    else if (analyticsPeriod === "allTime") startDate = new Date(2000, 0, 1); // fallback to very old date

    let endDate = today;
    if (analyticsPeriod === "lastMonth") {
      endDate = endOfMonth(subMonths(today, 1));
    }
    
    const relevantReservations = reservations.filter(r => {
      const dateToCheck = r.createdAt ? new Date(r.createdAt) : new Date(r.startDate);
      return dateToCheck >= startDate && dateToCheck <= endDate;
    });
    
    const totalBookings = relevantReservations.length;
    const totalRevenue = relevantReservations.reduce((acc, r) => acc + (r.status !== 'Cancelled' ? r.totalPrice : 0), 0);
    const cancelled = relevantReservations.filter(r => r.status === 'Cancelled').length;

    // Generate Chart Data (only meaningful if interval is relatively small, e.g. <= 60 days)
    const chartData: any[] = [];
    if (analyticsPeriod !== "allTime" && analyticsPeriod !== "thisYear") {
      const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
      let maxRevenue = 0;
      daysInterval.forEach(day => {
        const dayRevs = relevantReservations.filter(r => {
          const dateToCheck = r.createdAt ? new Date(r.createdAt) : new Date(r.startDate);
          return isSameDay(dateToCheck, day);
        });
        const revenue = dayRevs.reduce((acc, r) => acc + (r.status !== 'Cancelled' ? r.totalPrice : 0), 0);
        if (revenue > maxRevenue) maxRevenue = revenue;
        chartData.push({ date: day, revenue, bookings: dayRevs.length });
      });
      return { totalBookings, totalRevenue, cancelled, chartData, maxRevenue };
    }
    
    return { totalBookings, totalRevenue, cancelled, chartData: [], maxRevenue: 0 };
  }, [reservations, analyticsPeriod]);

  const uniqueGuests = useMemo(() => {
    const guestsMap = new Map();
    reservations.forEach(r => {
      if (r.status === 'Cancelled') return;
      const key = r.guestEmail || r.guestContact || r.userId || r.id;
      let guestName = "Guest";
      if (r.user?.name) guestName = r.user.name;
      else if (r.guests && r.guests.length > 0) guestName = `${r.guests[0].firstName} ${r.guests[0].lastName}`.trim();

      if (!guestsMap.has(key)) {
        guestsMap.set(key, {
          name: guestName, email: r.guestEmail || r.user?.email, phone: r.guestContact || r.user?.phone,
          totalBookings: 1, totalSpent: r.totalPrice, lastVisit: r.startDate, allReservations: [r]
        });
      } else {
        const existing = guestsMap.get(key);
        existing.totalBookings += 1;
        existing.totalSpent += r.totalPrice;
        existing.allReservations.push(r);
        if (new Date(r.startDate) > new Date(existing.lastVisit)) existing.lastVisit = r.startDate;
      }
    });
    return Array.from(guestsMap.values()).sort((a: any, b: any) => b.totalSpent - a.totalSpent);
  }, [reservations]);

  const handleExportCSV = useCallback(() => {
    if (uniqueGuests.length === 0) return toast.error("No data to export");
    const headers = ["Name,Email,Phone,Total Bookings,Total Spent,Last Visit"];
    const rows = uniqueGuests.map(g => `"${g.name}","${g.email || ''}","${g.phone || ''}",${g.totalBookings},${g.totalSpent},"${format(new Date(g.lastVisit), 'yyyy-MM-dd')}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${listing?.title?.replace(/\s+/g, '_') || 'Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [uniqueGuests, listing]);

  // === RESERVATION ACTIONS ===
  const onUpdateReservationStatus = useCallback(async (id: string, status: string) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/reservations/${id}`, { status });
      toast.success(`Booking ${status.toLowerCase()}`);
      router.refresh();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (error: any) {
      toast.error(error?.response?.data || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [router, selectedBooking]);

  // === REVIEW ACTIONS ===
  const onSubmitReview = useCallback(async () => {
    if (!reviewForm.guestId) return toast.error("Please select a guest");
    if (reviewForm.guestId === 'custom' && !reviewForm.customName.trim()) return toast.error("Please enter a custom guest name");
    if (!reviewForm.comment.trim()) return toast.error("Please enter a comment");
    setIsSubmittingReview(true);
    try {
      await axios.post("/api/reviews", {
        listingId: listing?.id,
        guestId: reviewForm.guestId,
        customName: reviewForm.customName,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success("Review added successfully!");
      setReviewForm({ guestId: '', customName: '', rating: 5, comment: '' });
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data || "Failed to add review.");
    } finally {
      setIsSubmittingReview(false);
    }
  }, [reviewForm, listing?.id, router]);

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
    allowsHourlyBooking: listing?.allowsHourlyBooking || false,
    hourlyRates: listing?.hourlyRates || { twoHours: '', threeHours: '', fourHours: '' },
    hourlyRoomCount: listing?.hourlyRoomCount || 1
  });

  const handleRoomPriceChange = (index: number, newPrice: number) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index] = { ...updatedRooms[index], price: newPrice };
    setFormData({ ...formData, rooms: updatedRooms });
  };

  const handleRoomCountChange = (index: number, newCount: number) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[index] = { ...updatedRooms[index], count: newCount };
    setFormData({ ...formData, rooms: updatedRooms });
  };

  const handleHourlyRateChange = (hours: string, value: string) => {
    setFormData({
      ...formData,
      hourlyRates: { ...formData.hourlyRates, [hours]: parseInt(value) || '' }
    });
  };

  const onUpdateProperty = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/listings/${listing.id}`, formData);
      toast.success("Changes saved successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data || "Update failed.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, listing?.id, router]);

  // === CALENDAR LOGIC ===
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const handleDateToggle = useCallback(async (date: Date) => {
    if (!listing) return;
    const currentBlocked = listing.blockedDates || [];
    const dateStr = date.toISOString();
    const isBlocked = currentBlocked.some((bd: string) => isSameDay(new Date(bd), date));
    let newBlockedDates;
    if (isBlocked) newBlockedDates = currentBlocked.filter((bd: string) => !isSameDay(new Date(bd), date));
    else newBlockedDates = [...currentBlocked, dateStr];
    
    setIsLoading(true);
    try {
      await axios.patch(`/api/listings/${listing.id}`, { blockedDates: newBlockedDates });
      toast.success(isBlocked ? "Date Unblocked" : "Date Blocked");
      router.refresh();
    } catch (error: any) {
      toast.error("Calendar update failed");
    } finally {
      setIsLoading(false);
    }
  }, [listing, router]);

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-white border-b border-neutral-100">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="px-5 py-2.5 rounded-full border border-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-all active:scale-95 shadow-sm">Prev</button>
          <h3 className="text-xl font-bold tracking-tight">{format(currentMonth, "MMMM yyyy")}</h3>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="px-5 py-2.5 rounded-full border border-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-all active:scale-95 shadow-sm">Next</button>
        </div>
        <div className="grid grid-cols-7 bg-white">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-neutral-400 text-xs py-4 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-neutral-100 gap-px border-t border-neutral-100">
          {days.map((day, i) => {
            const isBlocked = (listing.blockedDates || []).some((bd: string) => isSameDay(new Date(bd), day));
            const bookedCount = reservations.filter(r => r.status !== 'Cancelled' && day >= new Date(r.startDate) && day <= new Date(r.endDate)).length;
            const totalRooms = listing.rooms?.reduce((acc: number, room: any) => acc + (room.count || 1), 0) || 1;
            const isAllBooked = bookedCount >= totalRooms;
            
            let bgClass = "bg-white hover:bg-neutral-50 cursor-pointer";
            let textClass = "text-black";
            
            if (isAllBooked) {
              bgClass = "bg-emerald-50 cursor-not-allowed";
              textClass = "text-emerald-700";
            } else if (bookedCount > 0) {
              bgClass = "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-inner";
              textClass = "text-white";
            } else if (isBlocked) {
              bgClass = "bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer";
              textClass = "text-red-600";
            }
            
            if (day.getMonth() !== currentMonth.getMonth()) bgClass += " opacity-40";

            return (
              <div 
                key={i} 
                onClick={() => !isAllBooked && handleDateToggle(day)}
                className={`p-3 flex flex-col items-center justify-start min-h-[110px] transition-all duration-200 ${bgClass}`}
              >
                <span className={`text-sm font-semibold ${textClass}`}>{format(day, "d")}</span>
                
                {isAllBooked && (
                  <div className="mt-3 px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase tracking-wide">
                    Fully Booked
                  </div>
                )}
                {!isAllBooked && bookedCount > 0 && (
                  <div className="mt-3 px-2 py-1 bg-white/20 text-white rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm">
                    {bookedCount} Booking{bookedCount>1?'s':''}
                  </div>
                )}
                {isBlocked && !isAllBooked && bookedCount === 0 && (
                  <div className="mt-3 px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase tracking-wide">
                    Blocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (!listing) {
    return (
      <Container>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center print:hidden">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">No Properties Yet</h2>
          <p className="text-neutral-500 mb-8 max-w-md">Create your first listing to access the premium host dashboard and start managing bookings.</p>
          <button onClick={() => router.push('/become-a-host')} className="px-8 py-4 rounded-full bg-black text-white font-semibold hover:scale-105 hover:shadow-xl transition-all">
            Add Property Now
          </button>
        </div>
      </Container>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "New";

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pb-20">
      
      {/* HEADER - Hidden on Print */}
      <div className="border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-40 print:hidden">
        <Container>
          <div className="pt-10 pb-0 flex flex-col gap-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-light tracking-tight text-black mb-2">
                  Host Dashboard
                </h1>
                <div className="flex items-center gap-3">
                  {listing?.status && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${
                      listing.status === 'APPROVED' ? 'bg-black text-white' :
                      listing.status === 'PENDING' ? 'bg-neutral-200 text-neutral-600' :
                      listing.status === 'REJECTED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {listing.status}
                    </span>
                  )}
                  <div className="relative group flex items-center">
                    <span className="text-neutral-400 text-sm mr-2">Managing:</span>
                    <select 
                      className="appearance-none font-medium bg-transparent outline-none cursor-pointer text-sm text-black border-b border-neutral-200 hover:border-black transition-colors pr-6 py-1"
                      value={selectedListingId}
                      onChange={(e) => setSelectedListingId(e.target.value)}
                    >
                      {listings.map(l => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <button onClick={() => router.push(`/properties/${listing.id}`)} className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-neutral-200 hover:border-black hover:bg-neutral-50 transition-all text-xs font-semibold">
                    <ExternalLink size={14} /> View Listing
                  </button>
                  <button onClick={() => router.push('/')} className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-black text-white hover:bg-neutral-800 transition-all text-xs font-semibold">
                    Return to Website
                  </button>
              </div>
            </div>

            {/* Premium Underline Tabs */}
            <div className="flex overflow-x-auto gap-8 scrollbar-hide pt-2 relative">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs tracking-widest uppercase transition-all whitespace-nowrap relative ${
                    activeTab === tab 
                      ? "text-black font-bold" 
                      : "text-neutral-400 font-semibold hover:text-black"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              ))}
            </div>

          </div>
        </Container>
      </div>

      {/* MAIN CONTENT - Hidden on Print except specific modals */}
      <Container>
        <div className="pt-10 print:hidden">
          
          {/* Overview Tab */}
          {activeTab === "Overview" && (
            <div className="flex flex-col gap-12">
              
              {/* Minimal Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                
                <div onClick={() => setSelectedStat("pending")} className="group cursor-pointer">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2 group-hover:text-black transition-colors">Pending Request</div>
                  <div className="text-4xl font-light">{todayReservations.pending}</div>
                  <div className="h-[1px] w-full bg-neutral-100 mt-4 group-hover:bg-black transition-colors duration-300" />
                </div>

                <div onClick={() => setSelectedStat("checkIns")} className="group cursor-pointer">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2 group-hover:text-black transition-colors">Check-ins Today</div>
                  <div className="text-4xl font-light">{todayReservations.checkIns}</div>
                  <div className="h-[1px] w-full bg-neutral-100 mt-4 group-hover:bg-black transition-colors duration-300" />
                </div>

                <div onClick={() => setSelectedStat("checkOuts")} className="group cursor-pointer">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2 group-hover:text-black transition-colors">Check-outs Today</div>
                  <div className="text-4xl font-light">{todayReservations.checkOuts}</div>
                  <div className="h-[1px] w-full bg-neutral-100 mt-4 group-hover:bg-black transition-colors duration-300" />
                </div>

                <div onClick={() => setSelectedStat("active")} className="group cursor-pointer">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2 group-hover:text-black transition-colors">Currently Hosting</div>
                  <div className="text-4xl font-light">{todayReservations.active}</div>
                  <div className="h-[1px] w-full bg-neutral-100 mt-4 group-hover:bg-black transition-colors duration-300" />
                </div>

                <div onClick={() => setSelectedStat("cancelled")} className="group cursor-pointer">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2 group-hover:text-red-500 transition-colors">Cancelled</div>
                  <div className="text-4xl font-light text-neutral-400">{analyticsStats.cancelled}</div>
                  <div className="h-[1px] w-full bg-neutral-100 mt-4 group-hover:bg-red-500 transition-colors duration-300" />
                </div>
              </div>

              {/* Advanced Analytics Section */}
              <div className="border border-neutral-100 rounded-lg">
                <div className="p-6 md:p-8 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-light tracking-tight">Revenue Insights</h2>
                  </div>
                  <div className="relative group">
                    <select 
                      className="appearance-none bg-transparent border-b border-neutral-200 hover:border-black transition-colors pl-2 pr-8 py-1 outline-none text-xs tracking-widest uppercase font-bold cursor-pointer text-black"
                      value={analyticsPeriod}
                      onChange={(e) => setAnalyticsPeriod(e.target.value as any)}
                    >
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="thisYear">This Year</option>
                      <option value="allTime">All Time</option>
                      <option value={7}>Last 7 Days</option>
                      <option value={15}>Last 15 Days</option>
                      <option value={30}>Last 30 Days</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 text-black" />
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row">
                  {/* Left Stats */}
                  <div className="lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-100">
                    <div className="flex-1 p-8 border-b border-neutral-100">
                      <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Total Revenue</div>
                      <div className="text-3xl font-light tracking-tight">₹{analyticsStats.totalRevenue.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="flex-1 p-8">
                      <div className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-2">Total Bookings</div>
                      <div className="text-3xl font-light tracking-tight">{analyticsStats.totalBookings}</div>
                    </div>
                  </div>

                  {/* Clean Bar Chart */}
                  <div className="lg:w-2/3 p-8 flex items-end gap-3 h-72">
                    {analyticsStats.chartData.length > 0 ? (
                      analyticsStats.chartData.map((data, i) => {
                        const heightPercentage = analyticsStats.maxRevenue === 0 ? 0 : (data.revenue / analyticsStats.maxRevenue) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-10 bg-black text-white text-[10px] tracking-widest py-1.5 px-3 rounded shadow-sm pointer-events-none whitespace-nowrap z-10">
                              ₹{data.revenue.toLocaleString('en-IN')}
                            </div>
                            
                            <div 
                              className="w-full bg-neutral-100 group-hover:bg-neutral-800 transition-colors duration-300 rounded-sm"
                              style={{ height: `${Math.max(heightPercentage, 2)}%` }}
                            />
                            
                            {(analyticsPeriod === 7 || analyticsPeriod === 15 || i % Math.ceil(analyticsStats.chartData.length / 10) === 0) ? (
                              <div className="mt-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest -rotate-45 origin-top-left ml-2 whitespace-nowrap">
                                {format(data.date, 'MMM dd')}
                              </div>
                            ) : <div className="mt-4 h-3" />}
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                        Chart visualization only available for date ranges ≤ 60 days.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Bookings Tab */}
          {activeTab === "Live Bookings" && (
            <div className="border border-neutral-100 rounded-lg overflow-hidden">
              <div className="p-6 md:p-8 border-b border-neutral-100">
                <h2 className="text-xl font-light tracking-tight">Live Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-white border-b border-neutral-100 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-5 pl-8 font-normal">Guest</th>
                      <th className="p-5 font-normal">Contact</th>
                      <th className="p-5 font-normal">Dates</th>
                      <th className="p-5 font-normal">Status</th>
                      <th className="p-5 pr-8 text-right font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {reservations.length === 0 ? (
                      <tr><td colSpan={5} className="p-16 text-center text-neutral-400">No bookings found</td></tr>
                    ) : reservations.map(r => (
                      <tr key={r.id} className="hover:bg-neutral-50 transition-colors group">
                        <td className="p-5 pl-8">
                          <div className="font-semibold text-neutral-900">{r.user?.name || "Guest"}</div>
                          <div className="text-xs text-neutral-500 mt-1">{r.roomsCount || 1} room(s)</div>
                        </td>
                        <td className="p-5">
                          <div className="text-neutral-800">{r.guestContact || r.user?.phone || '--'}</div>
                          <div className="text-xs text-neutral-500">{r.guestEmail || r.user?.email || '--'}</div>
                        </td>
                        <td className="p-5">
                          <div className="text-neutral-900">{format(new Date(r.startDate), 'MMM dd, yyyy')}</div>
                          <div className="text-neutral-400 text-xs mt-1">to {format(new Date(r.endDate), 'MMM dd, yyyy')}</div>
                        </td>
                        <td className="p-5">
                          <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                            r.status === 'Pending' ? 'text-orange-600' :
                            r.status === 'Confirmed' ? 'text-black' :
                            r.status === 'Checked-in' ? 'text-emerald-600' :
                            r.status === 'Cancelled' ? 'text-red-500' : 'text-neutral-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'Pending' ? 'bg-orange-500' :
                              r.status === 'Confirmed' ? 'bg-black' :
                              r.status === 'Checked-in' ? 'bg-emerald-500' :
                              r.status === 'Cancelled' ? 'bg-red-500' : 'bg-neutral-300'
                            }`} />
                            {r.status || 'Confirmed'}
                          </span>
                        </td>
                        <td className="p-5 pr-8 text-right">
                          <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setSelectedBooking(r)}
                              className="text-xs font-semibold text-neutral-500 hover:text-black underline underline-offset-4"
                            >
                              View
                            </button>
                            {(r.status === 'Pending' || !r.status) && (
                              <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Confirmed')} className="text-xs font-semibold text-black hover:text-neutral-600 underline underline-offset-4">Accept</button>
                            )}
                            {r.status === 'Confirmed' && (
                              <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Checked-in')} className="text-xs font-semibold text-black hover:text-neutral-600 underline underline-offset-4">Check In</button>
                            )}
                            {r.status === 'Checked-in' && (
                              <button disabled={isLoading} onClick={() => onUpdateReservationStatus(r.id, 'Checked-out')} className="text-xs font-semibold text-black hover:text-neutral-600 underline underline-offset-4">Check Out</button>
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
            <div className="border border-neutral-100 rounded-lg overflow-hidden">
              <div className="p-6 md:p-8 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-xl font-light tracking-tight">Guest Directory</h2>
                <button onClick={handleExportCSV} className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors flex items-center gap-2">
                  <Download size={14} /> Export CSV
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-white border-b border-neutral-100 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="p-5 pl-8 font-normal">Guest</th>
                      <th className="p-5 font-normal">Contact</th>
                      <th className="p-5 text-center font-normal">Bookings</th>
                      <th className="p-5 font-normal">Total Value</th>
                      <th className="p-5 pr-8 font-normal">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {uniqueGuests.length === 0 ? (
                      <tr><td colSpan={5} className="p-16 text-center text-neutral-400">No guests found.</td></tr>
                    ) : uniqueGuests.map((g, i) => (
                      <tr key={i} className="hover:bg-neutral-50 transition-colors cursor-pointer group" onClick={() => setSelectedGuest(g)}>
                        <td className="p-5 pl-8 font-semibold text-neutral-900">{g.name}</td>
                        <td className="p-5">
                          <div className="text-neutral-800">{g.phone || "--"}</div>
                          <div className="text-xs text-neutral-500 mt-1">{g.email || "--"}</div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-neutral-500">{g.totalBookings}</span>
                        </td>
                        <td className="p-5 font-medium text-neutral-900">₹{g.totalSpent.toLocaleString('en-IN')}</td>
                        <td className="p-5 pr-8 text-neutral-500">{format(new Date(g.lastVisit), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Calendar View Tab */}
          {activeTab === "Calendar View" && (
             <div className="max-w-4xl mx-auto border border-neutral-100 rounded-lg p-8">
               <div className="mb-8 flex gap-6 text-[10px] font-bold uppercase tracking-widest text-neutral-400 justify-end">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neutral-200"></div> Available</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black"></div> Booked</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Blocked</div>
               </div>
               {renderCalendar()}
             </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "Reviews" && (
            <div className="flex flex-col gap-8">
              {/* Write Review Form */}
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-neutral-100">
                  <h2 className="text-xl font-light tracking-tight">Write a Review</h2>
                  <p className="text-sm text-neutral-500 mt-2">Write a review on behalf of a guest who stayed at your property.</p>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-6 bg-neutral-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Select Guest</label>
                      <select 
                        value={reviewForm.guestId}
                        onChange={(e) => setReviewForm({ ...reviewForm, guestId: e.target.value })}
                        className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm focus:border-black outline-none transition"
                      >
                        <option value="">-- Choose a guest --</option>
                        {uniqueGuests.map((g: any, idx: number) => {
                          const user_id = g.allReservations[0]?.userId || g.allReservations[0]?.user?.id;
                          return user_id ? (
                            <option key={idx} value={user_id}>{g.name} ({g.phone || g.email || 'No contact info'})</option>
                          ) : null;
                        })}
                        <option value="custom">-- Custom Guest --</option>
                      </select>
                      {reviewForm.guestId === 'custom' && (
                        <Input 
                          type="text" 
                          placeholder="Enter guest name" 
                          value={reviewForm.customName}
                          onChange={(e) => setReviewForm({ ...reviewForm, customName: e.target.value })}
                          className="h-12 w-full rounded-lg border border-neutral-200 mt-2 px-4 text-sm focus:border-black outline-none transition"
                        />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Rating</label>
                      <div className="flex gap-2 h-12 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`text-2xl transition hover:scale-110 ${reviewForm.rating >= star ? 'text-yellow-400' : 'text-neutral-200'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Review Comment</label>
                    <textarea 
                      placeholder="What did the guest think about this place?"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 p-4 min-h-[120px] focus:outline-none focus:border-black transition resize-none text-sm"
                    />
                  </div>

                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={onSubmitReview}
                      disabled={isSubmittingReview || !reviewForm.guestId || !reviewForm.comment.trim()}
                      className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isSubmittingReview ? "Submitting..." : "Publish Review"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white">
                <div className="p-6 md:p-8 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="text-xl font-light tracking-tight">Guest Reviews</h2>
                  <div className="flex items-center gap-3">
                    <span className="font-light text-2xl">{averageRating}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Average</span>
                      <span className="text-xs text-neutral-500">{reviews.length} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="p-0">
                  {reviews.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center">
                      <MessageSquare size={24} className="text-neutral-200 mb-4" />
                      <p className="text-neutral-400">No reviews yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {reviews.map((rev, idx) => (
                        <div key={idx} className="p-6 md:p-8 hover:bg-neutral-50 transition-colors">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600 bg-white">
                                {(rev.customName || rev.user?.name || 'G').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-neutral-900">{rev.customName || rev.user?.name || 'Guest'}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">{format(new Date(rev.createdAt), 'MMMM dd, yyyy')}</div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200 fill-neutral-200"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed font-light pl-12">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Property Management Tab */}
          {activeTab === "Property Management" && (
            <div className="border border-neutral-100 rounded-lg max-w-4xl mx-auto">
              <div className="p-6 md:p-8 border-b border-neutral-100">
                <h2 className="text-xl font-light tracking-tight">Property Settings</h2>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-10 mb-10">
                  {/* Hourly Pricing */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                      Hourly Rates (₹)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 block">2 HOURS</label>
                        <Input type="number" className="rounded-md h-10 bg-transparent border-neutral-200 focus:border-black font-medium" placeholder="Optional" value={formData.hourlyRates?.twoHours || ''} onChange={e => handleHourlyRateChange('twoHours', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 block">3 HOURS</label>
                        <Input type="number" className="rounded-md h-10 bg-transparent border-neutral-200 focus:border-black font-medium" placeholder="Optional" value={formData.hourlyRates?.threeHours || ''} onChange={e => handleHourlyRateChange('threeHours', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 block">4 HOURS</label>
                        <Input type="number" className="rounded-md h-10 bg-transparent border-neutral-200 focus:border-black font-medium" placeholder="Optional" value={formData.hourlyRates?.fourHours || ''} onChange={e => handleHourlyRateChange('fourHours', e.target.value)} />
                      </div>
                    </div>
                    <div className="mt-6 border-t border-neutral-100 pt-6">
                      <div className="w-full md:w-1/3">
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 block">TOTAL HOURLY ROOMS AVAILABLE</label>
                        <Input 
                          type="number" 
                          className="rounded-md h-10 bg-transparent border-neutral-200 focus:border-black font-medium" 
                          value={formData.hourlyRoomCount || ''} 
                          onChange={e => setFormData({ ...formData, hourlyRoomCount: parseInt(e.target.value) || 0 })} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Rooms */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Main Rooms Pricing & Availability (₹)</h3>
                    {(!formData.rooms || formData.rooms.length === 0) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 block">BASE PRICE</label>
                          <Input type="number" className="rounded-md h-10 bg-transparent border-neutral-200 focus:border-black font-medium" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {formData.rooms.map((room: any, idx: number) => (
                          <div key={idx} className="pb-6 border-b border-neutral-100 last:border-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                              <div className="font-semibold text-sm mb-1">{room.type || `Room ${idx + 1}`}</div>
                              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Capacity: {room.capacity}</div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div>
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Price</label>
                                <Input 
                                  type="number" 
                                  className="rounded-md h-9 w-32 border-neutral-200 focus:border-black font-medium text-sm"
                                  value={room.price} 
                                  onChange={e => handleRoomPriceChange(idx, parseInt(e.target.value) || 0)} 
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Quantity</label>
                                <div className="flex items-center gap-3">
                                  <button type="button" onClick={() => handleRoomCountChange(idx, Math.max(0, (room.count || 0) - 1))} className="w-8 h-8 rounded border border-neutral-200 flex items-center justify-center hover:border-black transition-colors">-</button>
                                  <div className="font-medium text-sm w-4 text-center">{room.count || 0}</div>
                                  <button type="button" onClick={() => handleRoomCountChange(idx, (room.count || 0) + 1)} className="w-8 h-8 rounded border border-neutral-200 flex items-center justify-center hover:border-black transition-colors">+</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-neutral-100">
                  <button
                    disabled={isLoading}
                    onClick={onUpdateProperty}
                    className="px-8 py-3 rounded-md bg-black text-white font-semibold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal: Simple Guest Details Stat Modal */}
        {selectedStat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 print:hidden">
            <div className="bg-white border border-neutral-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-xl font-light tracking-tight">
                  {selectedStat.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <button onClick={() => setSelectedStat(null)} className="text-neutral-400 hover:text-black transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-0 overflow-y-auto">
                {modalReservations.length === 0 ? (
                  <div className="p-16 text-center text-neutral-400 text-sm">No records found.</div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-neutral-100">
                      {modalReservations.map(r => (
                        <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-5 pl-6">
                            <div className="font-medium text-neutral-900">{r.user?.name || "Guest"}</div>
                            <div className="text-xs text-neutral-500 mt-1">{r.guestContact || r.user?.phone || '--'}</div>
                          </td>
                          <td className="p-5 text-neutral-600">
                            {format(new Date(r.startDate), 'MMM d, yyyy')} &rarr; {format(new Date(r.endDate), 'MMM d, yyyy')}
                          </td>
                          <td className="p-5 pr-6 text-right">
                            <div className="font-medium text-neutral-900">₹{r.totalPrice}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">{r.status || 'Confirmed'}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Guest Directory Details Modal */}
        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 print:hidden">
            <div className="bg-white border border-neutral-200 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 md:p-8 border-b border-neutral-100 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-light tracking-tight">{selectedGuest.name}</h2>
                  <div className="flex gap-4 mt-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                    <span>{selectedGuest.phone || "No Phone"}</span>
                    <span>{selectedGuest.email || "No Email"}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedGuest(null)} className="text-neutral-400 hover:text-black transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-0 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-neutral-100">
                    {selectedGuest.allReservations.map((res: any, idx: number) => (
                      <tr key={res.id || idx} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-6 pl-8">
                          <div className="font-semibold text-neutral-900 mb-1">{res.listing?.title || listing?.title || "Property"}</div>
                          <div className="text-xs text-neutral-500 mb-4">
                            {format(new Date(res.startDate), 'MMM d, yyyy')} &mdash; {format(new Date(res.endDate), 'MMM d, yyyy')}
                          </div>
                          
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Guests ({res.guests?.length || 1})</div>
                          {res.guests && res.guests.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {res.guests.map((g: any, gIdx: number) => (
                                <div key={gIdx} className="text-xs flex items-center justify-between max-w-sm">
                                  <span className="text-neutral-800">{g.firstName} {g.lastName}</span> 
                                  <span className="text-neutral-400">{g.gender}, Age {g.age}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-neutral-400">No additional guests.</div>
                          )}
                        </td>
                        <td className="p-6 pr-8 text-right align-top">
                          <div className="font-medium text-lg text-neutral-900">₹{res.totalPrice}</div>
                          <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                            res.status === 'Cancelled' ? 'text-red-500' : 'text-neutral-400'
                          }`}>
                            {res.status || 'Confirmed'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Container>
      
      {/* FULL PRINTABLE MODAL FOR DETAILED BOOKING */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm p-0 md:p-6 sm:p-4 overflow-y-auto print:bg-white print:p-0 print:block">
          <div className="bg-white border border-neutral-200 shadow-2xl w-full max-w-3xl min-h-screen md:min-h-0 md:my-8 flex flex-col relative print:border-none print:shadow-none">
            
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 md:p-6 bg-white border-b border-neutral-100 print:hidden">
              <div className="flex gap-4">
                <button onClick={handlePrint} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
                  <Printer size={14} /> Print
                </button>
                {selectedBooking.status !== 'Cancelled' && (
                  <button 
                    onClick={() => onUpdateReservationStatus(selectedBooking.id, 'Cancelled')}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    <Ban size={14} /> Cancel
                  </button>
                )}
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-neutral-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 md:p-12 print:p-0 bg-white text-black print:text-black">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-2xl font-light tracking-tight uppercase mb-2">Booking Receipt</h1>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">ID: {selectedBooking.id?.slice(-8)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Booked: {format(new Date(selectedBooking.createdAt || selectedBooking.startDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-medium">{listing?.title}</h2>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">{listing?.fullAddress || listing?.locationValue}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Guest Information</h3>
                  <div className="mt-4">
                    <p className="font-medium text-sm mb-1">{selectedBooking.user?.name || "Guest User"}</p>
                    <p className="text-neutral-500 text-xs mb-1">{selectedBooking.guestEmail || selectedBooking.user?.email || "No Email"}</p>
                    <p className="text-neutral-500 text-xs mb-4">{selectedBooking.guestContact || selectedBooking.user?.phone || "No Phone"}</p>
                    
                    {selectedBooking.guests && selectedBooking.guests.length > 0 && (
                      <div className="mt-6">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Additional Guests</p>
                        {selectedBooking.guests.map((g: any, i: number) => (
                          <div key={i} className="text-xs text-neutral-700 mb-1 flex items-center justify-between">
                            <span>{g.firstName} {g.lastName}</span>
                            <span className="text-neutral-400">{g.gender}, {g.age}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Stay Details</h3>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Check-in</p>
                        <p className="font-medium text-sm">{format(new Date(selectedBooking.startDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Check-out</p>
                        <p className="font-medium text-sm">{format(new Date(selectedBooking.endDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-neutral-500">Status</span>
                      <span className="font-bold text-black uppercase">{selectedBooking.status || 'Confirmed'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500">Rooms</span>
                      <span className="font-medium text-black">{selectedBooking.roomsCount || 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-100 pb-2">Payment Summary</h3>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-neutral-600">Base Price</span>
                    <span>₹{selectedBooking.basePrice || selectedBooking.totalPrice}</span>
                  </div>
                  {selectedBooking.taxes > 0 && (
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-neutral-600">Taxes & Fees</span>
                      <span>₹{selectedBooking.taxes}</span>
                    </div>
                  )}
                  {selectedBooking.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-neutral-600">Discount</span>
                      <span>-₹{selectedBooking.couponDiscount}</span>
                    </div>
                  )}
                  {selectedBooking.status === 'Cancelled' && (
                    <>
                      <div className="flex justify-between text-sm mb-3 text-red-500">
                        <span>Cancellation Fee</span>
                        <span>₹{selectedBooking.cancellationFee || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-neutral-600">Refund Amount</span>
                        <span>₹{selectedBooking.refundAmount || 0}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-base font-bold mt-4 pt-4 border-t border-black">
                    <span>Total Paid</span>
                    <span>₹{selectedBooking.totalPrice}</span>
                  </div>

                  {selectedBooking.razorpay_payment_id && (
                    <div className="mt-6 pt-4 border-t border-neutral-100">
                      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Payment Method Details</h3>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-600">Razorpay ID</span>
                        <span className="font-mono text-xs">{selectedBooking.razorpay_payment_id}</span>
                      </div>
                      {selectedBooking.paymentMethod && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-neutral-600">Method</span>
                          <span className="uppercase font-medium">{selectedBooking.paymentMethod}</span>
                        </div>
                      )}
                      
                      {selectedBooking.paymentDetails && selectedBooking.paymentMethod === 'card' && (
                        <div className="mt-3 bg-neutral-50 p-3 rounded border border-neutral-100 text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="text-neutral-500">Network:</span>
                            <span className="font-medium capitalize">{selectedBooking.paymentDetails.network}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-neutral-500">Card:</span>
                            <span className="font-medium">**** **** **** {selectedBooking.paymentDetails.last4}</span>
                          </div>
                          {selectedBooking.paymentDetails.name && (
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Name:</span>
                              <span className="font-medium">{selectedBooking.paymentDetails.name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedBooking.paymentDetails && selectedBooking.paymentMethod === 'upi' && (
                        <div className="mt-3 bg-neutral-50 p-3 rounded border border-neutral-100 text-xs">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">UPI ID:</span>
                            <span className="font-medium">{selectedBooking.paymentDetails.vpa}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center pt-8 border-t border-neutral-100 mt-12">
                <p className="text-xs text-neutral-400">System generated document for {listing?.title}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardClient;
