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
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  reviews = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const [selectedRoom, setSelectedRoom] = useState<any>(listing.rooms?.[0] || null);
  const currentPrice = selectedRoom ? selectedRoom.price : listing.price;

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

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id,
      roomType: selectedRoom ? selectedRoom.type : undefined
    })
      .then(() => {
        toast.success('Listing reserved!');
        setDateRange(initialDateRange);
        router.push('/trips');
      })
      .catch(() => {
        toast.error('Something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && currentPrice) {
        setTotalPrice(dayCount * currentPrice);
      } else {
        setTotalPrice(currentPrice);
      }
    }
  }, [dateRange, currentPrice]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            images={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6 relative">
            <div className="md:col-span-4">
              {listing.rooms && listing.rooms.length > 0 && (
                <>
                  <ListingRooms 
                    rooms={listing.rooms} 
                    selectedRoomId={selectedRoom?.id} 
                    onSelectRoom={setSelectedRoom} 
                  />
                  <hr className="border-neutral-200 my-8" />
                </>
              )}

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
                <ListingPolicies 
                  checkInTime={listing.checkInTime}
                  checkOutTime={listing.checkOutTime}
                  cancellationPolicy={listing.cancellationPolicy}
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
                />
              </div>
            </div>
          </div>

          <hr className="border-neutral-200 mb-8" />
          <ListingReviews reviews={reviews} listingId={listing.id} currentUser={currentUser} />

        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
