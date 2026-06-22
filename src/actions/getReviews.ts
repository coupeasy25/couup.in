import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { User } from "@/models/User";

interface IParams {
  listingId?: string;
}

export default async function getReviews(params: IParams) {
  try {
    const { listingId } = params;

    if (!listingId) {
      return [];
    }

    await connectToDatabase();

    // Make sure User model is registered before population
    User.schema;

    const reviews = await Review.find({ listingId })
      .populate('userId', 'name image') // Populate the author's name and image
      .sort({ createdAt: -1 })
      .lean();

    return reviews.map((review: any) => ({
      ...review,
      id: review._id.toString(),
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      user: review.userId ? {
        id: review.userId._id.toString(),
        name: review.userId.name,
        image: review.userId.image,
      } : null,
      userId: undefined
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}
