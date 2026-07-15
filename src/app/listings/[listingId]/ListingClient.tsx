"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter, useSearchParams } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";

import useLoginModal from "@/hooks/useLoginModal";
import Container from "@/components/Container";
import ListingHead from "@/components/listings/ListingHead";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingReservation from "@/components/listings/ListingReservation";

import Calendar from "@/components/inputs/Calendar";
import ListingReviews from "@/components/listings/ListingReviews";
import ListingMap from "@/components/listings/ListingMap";
import ListingPolicies from "@/components/listings/ListingPolicies";
import ListingRooms from "@/components/listings/ListingRooms";

import ListingAmenities from "@/components/listings/ListingAmenities";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: any[];
  reviews?: any[];
  listing: any & { user: any };
  currentUser?: any | null;
  settings?: any;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  reviews = [],
  currentUser,
  settings,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const [selectedRoom, setSelectedRoom] = useState<any>(listing.rooms?.[0] || null);
  const currentPrice = selectedRoom ? selectedRoom.price : listing.price;

  const disabledDates = useMemo(() => {
    let disabledDatesList: Date[] = [];

    // Filter reservations by selected room type if available
    const relevantReservations = selectedRoom 
      ? reservations.filter(res => res.roomType === selectedRoom.type)
      : reservations;

    // Determine max available count for the selected room type
    const maxCount = selectedRoom ? (selectedRoom.count || 1) : 1;

    // Count reservations per date
    const dateCounts: Record<string, number> = {};

    relevantReservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      range.forEach(date => {
        // Use a simple date string (YYYY-MM-DD) for counting
        const dateString = date.toISOString().split('T')[0];
        dateCounts[dateString] = (dateCounts[dateString] || 0) + 1;
      });
    });

    // Add dates to disabledDatesList if count >= maxCount
    Object.keys(dateCounts).forEach(dateString => {
      if (dateCounts[dateString] >= maxCount) {
        disabledDatesList.push(new Date(dateString));
      }
    });

    if (listing.blockedDates && Array.isArray(listing.blockedDates)) {
      listing.blockedDates.forEach((blockedDate: any) => {
        disabledDatesList.push(new Date(blockedDate));
      });
    }

    return disabledDatesList;
  }, [reservations, selectedRoom, listing.blockedDates]);

  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Check if current user has booked this listing
  const hasBooked = useMemo(() => {
    if (!currentUser) return false;
    return reservations.some((res: any) => 
      (res.userId === currentUser.id || res.userId === currentUser._id) && res.status !== 'Cancelled'
    );
  }, [reservations, currentUser]);

  const [dateRange, setDateRange] = useState<Range>(() => {
    const startDateParam = searchParams?.get('startDate');
    const endDateParam = searchParams?.get('endDate');

    if (startDateParam && endDateParam) {
      return {
        startDate: new Date(startDateParam),
        endDate: new Date(endDateParam),
        key: 'selection'
      };
    }
    return initialDateRange;
  });

  useEffect(() => {
    const startDateParam = searchParams?.get('startDate');
    const endDateParam = searchParams?.get('endDate');

    if (startDateParam && endDateParam) {
      setDateRange({
        startDate: new Date(startDateParam),
        endDate: new Date(endDateParam),
        key: 'selection'
      });
    }
  }, [searchParams]);

  const [totalPrice, setTotalPrice] = useState(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && currentPrice) {
        return dayCount * currentPrice;
      }
    }
    return currentPrice;
  });

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select check-in and checkout dates.');
      return;
    }

    setIsLoading(true);

    try {
      const roomType = selectedRoom ? selectedRoom.type : '';
      const checkRes = await axios.post('/api/reservations/check', {
        listingId: listing?.id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        roomType: roomType,
        roomsCount: 1 // Default to 1 for the initial check on listing page
      });

      if (!checkRes.data.available) {
        toast.error(checkRes.data.message || 'Rooms not available for selected dates.');
        setIsLoading(false);
        return;
      }

      const start = dateRange.startDate.toISOString();
      const end = dateRange.endDate.toISOString();
      const url = `/book/${listing?.id}?startDate=${start}&endDate=${end}&roomType=${encodeURIComponent(roomType)}`;
      router.push(url);
    } catch (error) {
      toast.error('Failed to check availability.');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, listing?.id, router, currentUser, loginModal, selectedRoom]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      let currentDate = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      let calculatedBasePrice = 0;

      if (currentDate.getTime() === end.getTime()) {
        calculatedBasePrice = currentPrice;
      } else {
        while (currentDate < end) {
          const dayOfWeek = currentDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          let dailyPrice = currentPrice;
          if (isWeekend && listing.weekendPrice) {
            dailyPrice = Number(listing.weekendPrice);
          }
          calculatedBasePrice += dailyPrice;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      const welcomeDiscount = listing.hasWelcomeOffer ? 500 : 0;
      setTotalPrice(Math.max(0, calculatedBasePrice - welcomeDiscount));
    }
  }, [dateRange, currentPrice, listing.weekendPrice, listing.hasWelcomeOffer]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pt-[90px]">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            images={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
            peoplePerRoom={listing.peoplePerRoom}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6 relative">
            <div className="md:col-span-4">
              <ListingInfo
                user={listing.user}
                description={listing.description}
                title={listing.title}
                propertyType={listing.propertyType}
                peoplePerRoom={listing.peoplePerRoom}
                bathroomType={listing.bathroomType}
                amenities={listing.amenities}
                standoutAmenities={listing.standoutAmenities}
                safetyItems={listing.safetyItems}
              />

              {listing.rooms && listing.rooms.length > 0 && (
                <>
                  <hr className="border-neutral-200 my-8" />
                  <ListingRooms 
                    rooms={listing.rooms} 
                    selectedRoomId={selectedRoom?.id} 
                    onSelectRoom={setSelectedRoom} 
                  />
                </>
              )}

              <hr className="border-neutral-200 my-8" />
              
              <div className="pb-10">
                <ListingAmenities 
                  amenities={listing.amenities}
                  standoutAmenities={listing.standoutAmenities}
                  safetyItems={listing.safetyItems}
                />
              </div>

              <hr className="border-neutral-200 mb-8" />
              <div className="pb-10">
                <h2 className="text-2xl font-semibold mb-4">Select checkout date</h2>
                <div className="font-light text-neutral-600 mb-6">Add your travel dates for exact pricing</div>
                <Calendar
                  value={dateRange}
                  disabledDates={disabledDates}
                  onChange={(value) => setDateRange(value.selection)}
                />
              </div>

              <hr className="border-neutral-200 mb-8" />
              <div className="pb-10">
                <ListingMap fullAddress={listing.fullAddress} coordinates={listing.coordinates} />
              </div>

              <hr className="border-neutral-200 mb-8" />
              <div className="pb-10">
                <ListingPolicies 
                  checkInTime={listing.checkInTime}
                  checkOutTime={listing.checkOutTime}
                  cancellationPolicy={listing.cancellationPolicy}
                  cancellationRules={listing.cancellationRules}
                  cancellationDays={listing.cancellationDays}
                  cancellationDeduction={listing.cancellationDeduction}
                  allowsHourlyBooking={listing.allowsHourlyBooking}
                  hourlyCancellationPolicy={listing.hourlyCancellationPolicy}
                  hourlyCancellationRules={listing.hourlyCancellationRules}
                  smokingAllowed={listing.smokingAllowed}
                  petsAllowed={listing.petsAllowed}
                  partyAllowed={listing.partyAllowed}
                />
              </div>

            </div>

            <div className="order-first mb-10 md:order-last md:col-span-3">
              <div className="sticky top-24">
                <ListingReservation
                  price={currentPrice}
                  totalPrice={totalPrice}
                  onChangeDate={(value) => setDateRange(value)}
                  dateRange={dateRange}
                  onSubmit={onCreateReservation}
                  disabled={isLoading}
                  disabledDates={disabledDates}
                  guestCount={Number(searchParams?.get('guestCount') || 1)}
                  selectedRoomName={selectedRoom?.type}
                  settings={settings}
                />
              </div>
            </div>
          </div>

          <ListingReviews reviews={reviews} listingId={listing.id} currentUser={currentUser} />

        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
