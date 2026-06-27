"use client";

import Avatar from "../Avatar";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";

interface ListingReviewsProps {
  reviews?: any[];
  listingId?: string;
  currentUser?: any | null;
}

const ListingReviews: React.FC<ListingReviewsProps> = ({ reviews = [], listingId, currentUser }) => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.00";
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(2);
  }, [reviews]);

  const onSubmit = () => {
    if (!currentUser) {
      toast.error("You must be logged in to leave a review.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    setIsLoading(true);

    axios.post("/api/reviews", {
      listingId,
      rating,
      comment
    })
    .then(() => {
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      router.refresh();
    })
    .catch(() => {
      toast.error("Something went wrong.");
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

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

      {/* Write a Review */}
      {currentUser && (
        <div className="bg-neutral-50 rounded-2xl p-6 mb-8 border-[1px] border-neutral-200">
          <h3 className="text-lg font-semibold mb-4">Write a review</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-sm text-neutral-600">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-neutral-300'} transition hover:scale-110`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              disabled={isLoading}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think about this place?"
              className="w-full rounded-xl border-[1px] border-neutral-300 p-4 font-light min-h-[100px] focus:outline-none focus:border-black transition"
            />
            <Button
              disabled={isLoading}
              onClick={onSubmit}
              className="w-max bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold"
            >
              Submit Review
            </Button>
          </div>
        </div>
      )}

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
                  <div className="font-semibold">{review.user?.name || 'User'}</div>
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
