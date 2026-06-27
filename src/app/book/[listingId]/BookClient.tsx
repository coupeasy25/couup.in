"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { differenceInCalendarDays, format } from "date-fns";

import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface BookClientProps {
  listing: any;
  currentUser?: any | null;
  settings?: any;
}

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

const BookClient: React.FC<BookClientProps> = ({ listing, currentUser, settings }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDateParam = searchParams?.get('startDate');
  const endDateParam = searchParams?.get('endDate');
  const roomTypeParam = searchParams?.get('roomType');

  const selectedRoom = useMemo(() => {
    if (!roomTypeParam || !listing.rooms) return null;
    return listing.rooms.find((r: any) => r.type === roomTypeParam) || null;
  }, [listing.rooms, roomTypeParam]);

  const roomCapacity = selectedRoom ? selectedRoom.capacity : listing.peoplePerRoom;
  const roomCountAvailable = selectedRoom ? (selectedRoom.count || 1) : (listing.roomCount || 1);
  const maxGuests = roomCapacity * roomCountAvailable;
  const currentPrice = selectedRoom ? selectedRoom.price : listing.price;

  const dateRange = useMemo(() => {
    if (startDateParam && endDateParam) {
      return {
        startDate: new Date(startDateParam),
        endDate: new Date(endDateParam)
      };
    }
    return null;
  }, [startDateParam, endDateParam]);

  const [guests, setGuests] = useState([{ firstName: '', lastName: '', gender: 'Male', age: '' }]);
  const [guestContact, setGuestContact] = useState(currentUser?.phone || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [gstState, setGstState] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requiredRooms = Math.ceil(guests.length / roomCapacity) || 1;

  const { basePrice, dayCount } = useMemo(() => {
    if (!dateRange?.startDate || !dateRange?.endDate) return { basePrice: 0, dayCount: 1 };

    let total = 0;
    let days = 0;
    let currentDate = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    // If same day booking
    if (currentDate.getTime() === end.getTime()) {
      total = currentPrice;
      days = 1;
    } else {
      while (currentDate < end) {
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

        let dailyPrice = currentPrice;
        if (isWeekend && listing.weekendPrice) {
          dailyPrice = Number(listing.weekendPrice);
        } else if (listing.festivalPrice) {
          // If festival price is set, maybe it overrides base price during the season
          // dailyPrice = Number(listing.festivalPrice);
        }

        total += dailyPrice;
        days++;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return { basePrice: total * requiredRooms, dayCount: days };
  }, [dateRange, currentPrice, listing.weekendPrice, listing.festivalPrice, requiredRooms]);

  const couupFeePercentage = settings?.couupFeePercentage ?? 5;
  const gstPercentage = settings?.gstPercentage ?? 18;

  const serviceFee = (basePrice * couupFeePercentage) / 100;
  const gstAmount = (basePrice * gstPercentage) / 100;

  const taxes = serviceFee + gstAmount; // Combined fees + taxes
  const welcomeDiscount = listing.hasWelcomeOffer ? 500 : 0;
  const totalPrice = Math.max(0, basePrice + taxes - welcomeDiscount);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  const addGuest = () => {
    if (guests.length < maxGuests) {
      setGuests([...guests, { firstName: '', lastName: '', gender: 'Male', age: '' }]);
    }
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    toast.error('Invalid or expired coupon code.');
  };

  const onSubmit = useCallback(async () => {
    // Validation
    const emptyGuest = guests.find(g => !g.firstName || !g.lastName || !g.age);
    if (emptyGuest) {
      return toast.error("Please fill in all guest details.");
    }
    if (!guestContact || !guestEmail) {
      return toast.error("Please provide your contact number and email.");
    }
    if (!gstState) {
      return toast.error("Please select your state for GST purposes.");
    }

    setIsLoading(true);

    try {
      // 1. Create Razorpay Order
      const orderResponse = await axios.post('/api/razorpay/order', { amount: totalPrice });
      const order = orderResponse.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the public key
        amount: order.amount,
        currency: order.currency,
        name: "Couup Hotels & Resorts",
        description: "Booking Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment and Create Reservation
          try {
            await axios.post('/api/reservations', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              totalPrice,
              basePrice,
              taxes,
              startDate: dateRange?.startDate,
              endDate: dateRange?.endDate,
              listingId: listing?.id,
              roomType: selectedRoom ? selectedRoom.type : undefined,
              guests,
              guestContact,
              guestEmail,
              gstState,
              roomsCount: requiredRooms
            });
            toast.success('Reservation confirmed!');
            router.push('/trips');
          } catch (err: any) {
            toast.error(err?.response?.data || 'Payment verification failed.');
          }
        },
        prefill: {
          name: currentUser?.name || guests[0].firstName + ' ' + guests[0].lastName,
          email: currentUser?.email || '',
        },
        theme: {
          color: "#F97316" // Couup brand color
        }
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.on('payment.failed', function (response: any) {
        toast.error(response.error.description || "Payment failed. Please try again.");
      });

      paymentObject.open();

    } catch (error: any) {
      toast.error('Failed to initiate payment.');
    } finally {
      setIsLoading(false);
    }
  }, [totalPrice, basePrice, taxes, dateRange, listing?.id, selectedRoom, guests, gstState, router, currentUser]);

  if (!dateRange) {
    return (
      <Container>
        <div className="pt-24 text-center">Invalid booking dates. Please return to the listing.</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="pt-10 pb-20">
        <h1 className="text-3xl font-bold mb-8">Review your Booking</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-8">

            {/* Booking Details Box */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="p-8 flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                  <Image fill src={listing.imageSrc[0]} alt="Property" className="object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold">{listing.title}</h2>
                  <div className="text-neutral-500 font-light">{listing.locationValue}</div>
                  <div className="text-sm font-semibold mt-auto px-2 py-1 bg-neutral-100 rounded-md self-start">
                    ★ {listing.averageRating ? Number(listing.averageRating).toFixed(2) : "New"}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/80 p-8 flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Check In</div>
                  <div className="font-semibold">{format(dateRange.startDate, 'EEE, dd MMM yyyy')}</div>
                  <div className="text-sm text-neutral-500">{listing.checkInTime || '2 PM'}</div>
                </div>
                <div className="hidden sm:block text-neutral-300 font-light text-2xl">|</div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Check Out</div>
                  <div className="font-semibold">{format(dateRange.endDate, 'EEE, dd MMM yyyy')}</div>
                  <div className="text-sm text-neutral-500">{listing.checkOutTime || '11 AM'}</div>
                </div>
                <div className="hidden sm:block text-neutral-300 font-light text-2xl">|</div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Duration & Room</div>
                  <div className="font-semibold">{dayCount} Night{dayCount > 1 ? 's' : ''}</div>
                  <div className="text-sm text-neutral-500">{selectedRoom ? selectedRoom.type : 'Entire property'}</div>
                </div>
              </div>
            </div>

            {/* Contact Details Box */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <h2 className="text-xl font-bold mb-6">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Phone Number</label>
                  <Input value={guestContact} onChange={(e) => setGuestContact(e.target.value)} placeholder="Enter mobile number" />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">Email Address</label>
                  <Input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Enter email" />
                </div>
              </div>
            </div>

            {/* Guest Details Box */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Guest Details</h2>
                <div className="text-sm text-neutral-500">{guests.length} / {maxGuests} Guests Allowed</div>
              </div>

              <div className="flex flex-col gap-8">
                {Array.from({ length: requiredRooms }).map((_, roomIndex) => {
                  const startIdx = roomIndex * roomCapacity;
                  const endIdx = Math.min(startIdx + roomCapacity, guests.length);
                  const roomGuests = guests.slice(startIdx, endIdx);

                  return (
                    <div key={`room-${roomIndex}`} className="flex flex-col gap-4">
                      <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-100 pb-2">Room {roomIndex + 1}</h3>
                      <div className="flex flex-col gap-6">
                        {roomGuests.map((guest, idx) => {
                          const globalIndex = startIdx + idx;
                          return (
                            <div key={globalIndex} className="flex flex-col gap-5 p-6 border-[1px] border-neutral-100 bg-neutral-50/50 rounded-2xl">
                              <div className="flex justify-between items-center">
                                <div className="font-semibold text-sm uppercase text-neutral-500">
                                  {globalIndex === 0 ? "Primary Guest" : `Guest ${globalIndex + 1}`}
                                </div>
                                {globalIndex !== 0 && (
                                  <button onClick={() => removeGuest(globalIndex)} className="text-red-500 hover:bg-red-50 p-1 rounded-md transition">
                                    <Minus size={16} />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-semibold mb-1 block">First Name</label>
                                  <Input value={guest.firstName} onChange={(e) => updateGuest(globalIndex, 'firstName', e.target.value)} placeholder="e.g. John" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold mb-1 block">Last Name</label>
                                  <Input value={guest.lastName} onChange={(e) => updateGuest(globalIndex, 'lastName', e.target.value)} placeholder="e.g. Doe" />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold mb-1.5 text-neutral-600 block">Gender</label>
                                  <select
                                    value={guest.gender}
                                    onChange={(e) => updateGuest(globalIndex, 'gender', e.target.value)}
                                    className="flex h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 transition-all outline-none"
                                  >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs font-semibold mb-1 block">Age</label>
                                  <Input type="number" value={guest.age} onChange={(e) => updateGuest(globalIndex, 'age', e.target.value)} placeholder="e.g. 25" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {guests.length < maxGuests && (
                  <button 
                    onClick={addGuest}
                    className="flex items-center justify-center gap-2 text-[#F97316] font-semibold text-sm py-3 px-6 border border-[#F97316]/50 bg-[#F97316]/5 rounded-xl w-full hover:border-[#F97316] transition-all mt-2"
                  >
                    <Plus size={16} /> Add Another Guest
                  </button>
                )}
              </div>
            </div>

            {/* GST State Box */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <h2 className="text-xl font-bold mb-2">Your State</h2>
              <p className="text-sm text-neutral-500 mb-6">Required for GST purpose on your tax invoice.</p>

              <div className="max-w-md">
                <label className="text-xs font-semibold mb-1.5 text-neutral-600 block">Select State</label>
                <select
                  value={gstState}
                  onChange={(e) => setGstState(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 transition-all outline-none"
                >
                  <option value="" disabled>Select your state</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Summary) */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">

              {/* Price Summary */}
              <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex flex-col gap-5">
                <h2 className="text-2xl font-bold mb-2">Price Summary</h2>
                <div className="flex justify-between items-center text-sm">
                  <span>Base Price ({dayCount} night{dayCount > 1 ? 's' : ''} x {requiredRooms} room{requiredRooms > 1 ? 's' : ''})</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Taxes & Service Fee</span>
                  <span>₹{(serviceFee + gstAmount).toLocaleString('en-IN')}</span>
                </div>
                {welcomeDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm text-green-600 font-semibold">
                    <span>Welcome Offer</span>
                    <span>-₹{welcomeDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <hr className="border-neutral-200" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Coupon Codes */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h2 className="text-xl font-bold mb-4 text-[#F97316]">Coupon Codes</h2>
                <div className="flex gap-3">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="h-12 rounded-xl focus-visible:ring-[#F97316]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#F97316] text-white px-6 rounded-xl font-semibold text-sm hover:bg-[#EA580C] transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Payment Button */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 flex flex-col gap-5">
                <div className="text-xs text-neutral-500 text-center leading-relaxed font-medium">
                  By proceeding, I agree to the User Agreement, Terms of Service and Cancellation Policies.
                </div>
                <button
                  disabled={isLoading}
                  onClick={onSubmit}
                  className="w-full relative bg-[#F97316] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#EA580C] transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Processing...' : 'Confirm and pay'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BookClient;
