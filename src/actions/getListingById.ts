import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { User } from "@/models/User";
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

    return {
      ...listing,
      id: listing._id.toString(),
      _id: listing._id.toString(),
      createdAt: listing.createdAt.toISOString(),
      userId: listing.userId._id.toString(),
      user: {
        ...listing.userId,
        _id: listing.userId._id.toString(),
        id: listing.userId._id.toString(),
        createdAt: listing.userId.createdAt?.toISOString() || null,
        updatedAt: listing.userId.updatedAt?.toISOString() || null,
        emailVerified: listing.userId.emailVerified?.toISOString() || null,
      },
      rooms: listing.rooms ? listing.rooms.map((room: any) => ({
        ...room,
        _id: room._id ? room._id.toString() : undefined
      })) : []
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
