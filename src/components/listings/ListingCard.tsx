"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import HeartButton from "../HeartButton";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

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

      onEdit?.(data.id);
    },
    [onEdit, data.id, disabled]
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

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

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
    let url = `/listings/${data.id}`;
    if (searchParams && searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
    router.push(url);
  }, [router, data.id, searchParams, onViewDetails, reservation]);

  return (
    <div
      onClick={onClick}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-[4/3] w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc?.[0] || "/images/placeholder.jpg"}
            alt="Listing"
          />
          <div className="absolute top-3 right-3">
            <HeartButton 
              listingId={data.id || data._id} 
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="flex flex-col mt-1">
          <div className="font-semibold text-[15px] truncate">
            {data.title}
          </div>
          <div className="font-light text-neutral-500 text-[15px]">
            {reservationDate || `₹${price} for 1 night · ★ ${rating}`}
          </div>
        </div>
        {onEdit && (
          <button
            disabled={disabled}
            onClick={handleEdit}
            className="w-full mt-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0f3d30] rounded-md py-2 font-semibold transition disabled:opacity-50"
          >
            Edit property
          </button>
        )}
        {onAction && actionLabel && (
          <button
            disabled={disabled}
            onClick={handleCancel}
            className="w-full mt-2 bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white rounded-md py-2 font-semibold transition disabled:opacity-50"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;