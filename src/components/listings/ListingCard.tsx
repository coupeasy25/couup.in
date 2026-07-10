"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import HeartButton from "../HeartButton";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ListingCardProps {
  data: any;
  reservation?: any;
  onAction?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewDetails?: (reservation: any) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: any | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  onEdit,
  onViewDetails,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const handleEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onEdit?.(data.id || data._id);
    },
    [onEdit, data.id, data._id, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    if (reservation.isHourlyBooking) {
      return `${format(start, "PP")} (${reservation.checkInTime} for ${reservation.hourlyDuration} hours)`;
    }

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = data.imageSrc && data.imageSrc.length > 0 ? data.imageSrc : ["/images/placeholder.jpg"];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const rating = useMemo(() => {
    if (data?.averageRating) {
      return Number(data.averageRating).toFixed(2);
    }
    return "New";
  }, [data?.averageRating]);

  const onClick = useCallback(() => {
    if (onViewDetails && reservation) {
      return onViewDetails(reservation);
    }
    let url = `/listings/${data.id || data._id}`;
    if (searchParams && searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
    router.push(url);
  }, [router, data.id, data._id, searchParams, onViewDetails, reservation]);

  return (
    <div
      onClick={onClick}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500 ease-in-out"
            src={images[currentImageIndex]}
            alt="Listing"
          />
          {/* Subtle gradient for dots visibility */}
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent z-0"></div>
          )}
          
          <div className="absolute top-3 right-3 z-10">
            <HeartButton
              listingId={data.id || data._id}
              currentUser={currentUser}
            />
          </div>

          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <div
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                >
                  <ChevronLeft size={18} className="text-neutral-700" />
                </div>
              )}
              {currentImageIndex < images.length - 1 && (
                <div
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white hover:scale-110 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                >
                  <ChevronRight size={18} className="text-neutral-700" />
                </div>
              )}

              {/* Dots indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 z-10">
                {images.map((_: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 shadow-sm ${index === currentImageIndex ? 'bg-white w-2 h-2 opacity-100' : 'bg-white/70 w-1.5 h-1.5 opacity-60 hover:bg-white/90'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col mt-2 gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-[16px] text-neutral-900 truncate">
              {data.title}
            </div>
            <div className="flex items-center gap-1 text-[14px] font-medium text-neutral-800 shrink-0 mt-0.5">
              <span>★</span>
              <span>{rating}</span>
            </div>
          </div>
          
          {data.locationValue && (
            <div className="font-light text-neutral-500 text-[14px]">
              {data.locationValue}
            </div>
          )}
          
          <div className="font-light text-neutral-500 text-[14px] mt-1 flex items-center justify-between">
            {reservationDate ? (
              <span>{reservationDate}</span>
            ) : (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[15px] text-neutral-900">₹{price}</span>
                <span>night</span>
              </div>
            )}
            
            {reservation && reservation.status && (
              <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${reservation.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                reservation.status === 'Checked-in' ? 'bg-green-100 text-green-700' :
                  reservation.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    reservation.status === 'Checked-out' ? 'bg-neutral-200 text-neutral-700' :
                      'bg-yellow-100 text-yellow-700'
                }`}>
                {reservation.status}
              </span>
            )}
          </div>
        </div>
        {onEdit && (
          <button
            disabled={disabled}
            onClick={handleEdit}
            className="w-full mt-2 bg-[#FFFFFF] hover:bg-[#F97316]/90 text-[#F97316] rounded-md py-2 font-semibold transition disabled:opacity-50"
          >
            Edit property
          </button>
        )}
        {onAction && actionLabel && (
          <button
            disabled={disabled}
            onClick={handleCancel}
            className="w-full mt-2 bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-md py-2 font-semibold transition disabled:opacity-50"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;