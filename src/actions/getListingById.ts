import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { User } from "@/models/User";
import { Review } from "@/models/Review";
import mongoose from "mongoose";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    await connectToDatabase();

    const { listingId } = params;

    if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
      return null;
    }

    const listing = await Listing.findById(listingId).populate('userId').lean() as any;

    if (!listing) {
      return null;
    }

    const reviewsData = await Review.find({ listingId }).populate('userId', 'name image').sort({ createdAt: -1 }).lean() as any[];
    const reviews = reviewsData.map((review) => ({
      ...review,
      id: review._id.toString(),
      _id: review._id.toString(),
      listingId: review.listingId.toString(),
      userId: review.userId ? (review.userId._id ? review.userId._id.toString() : review.userId.toString()) : null,
      createdAt: review.createdAt?.toISOString ? review.createdAt.toISOString() : null,
      updatedAt: review.updatedAt?.toISOString ? review.updatedAt.toISOString() : null,
      user: review.userId ? {
        id: review.userId._id ? review.userId._id.toString() : review.userId.toString(),
        name: review.userId.name || 'Unknown User',
        image: review.userId.image || null,
      } : null
    }));

    return {
      ...listing,
      id: listing._id.toString(),
      _id: listing._id.toString(),
      createdAt: listing.createdAt?.toISOString ? listing.createdAt.toISOString() : null,
      userId: listing.userId ? (listing.userId._id ? listing.userId._id.toString() : listing.userId.toString()) : null,
      user: listing.userId ? {
        ...listing.userId,
        _id: listing.userId._id ? listing.userId._id.toString() : listing.userId.toString(),
        id: listing.userId._id ? listing.userId._id.toString() : listing.userId.toString(),
        createdAt: listing.userId.createdAt?.toISOString() || null,
        updatedAt: listing.userId.updatedAt?.toISOString() || null,
        emailVerified: listing.userId.emailVerified?.toISOString() || null,
      } : null,
      rooms: listing.rooms ? listing.rooms.map((room: any) => ({
        ...room,
        _id: room._id ? room._id.toString() : undefined
      })) : [],
      cancellationRules: listing.cancellationRules ? listing.cancellationRules.map((rule: any) => ({
        ...rule,
        _id: rule._id ? rule._id.toString() : undefined
      })) : [],
      hourlyCancellationRules: listing.hourlyCancellationRules ? listing.hourlyCancellationRules.map((rule: any) => ({
        ...rule,
        _id: rule._id ? rule._id.toString() : undefined
      })) : [],
      reviews: reviews
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
