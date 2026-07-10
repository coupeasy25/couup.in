"use client";

import Avatar from "../Avatar";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

interface ListingReviewsProps {
  reviews?: any[];
  listingId?: string;
  currentUser?: any | null;
  hasBooked?: boolean;
}

const ListingReviews: React.FC<ListingReviewsProps> = ({ reviews = [], listingId, currentUser, hasBooked = false }) => {
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.00";
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(2);
  }, [reviews]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Rating Header */}
      <div className="flex flex-row items-center gap-2 text-2xl font-semibold mt-4 mb-8">
        {reviews.length > 0 ? (
          <>
            <span>★</span>
            <span>{averageRating}</span>
            <span>·</span>
            <span>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
          </>
        ) : (
          <span>No reviews (yet)</span>
        )}
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="text-center font-light text-neutral-500 my-8">
          No reviews yet. Be the first to leave one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                <Avatar src={review.user?.image} />
                <div className="flex flex-col">
                  <div className="font-semibold">{review.customName || review.user?.name || 'User'}</div>
                  <div className="text-sm font-light text-neutral-500">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center text-xs font-light text-neutral-500">
                <span className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <div className="text-[16px] font-light text-neutral-800 leading-relaxed">
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ListingReviews;
