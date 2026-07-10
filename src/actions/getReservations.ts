import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { Listing } from "@/models/Listing";
import mongoose from "mongoose";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
  status?: string;
}

export default async function getReservations(params: IParams) {
  try {
    await connectToDatabase();
    
    const { listingId, userId, authorId, status } = params;

    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (listingId) {
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return [];
      }
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      // Find listings owned by authorId, then find reservations for those listings
      const listings = await Listing.find({ userId: authorId }).select('_id').lean();
      const listingIds = listings.map((l: any) => l._id);
      query.listingId = { $in: listingIds };
    }

    const reservations = await Reservation.find(query)
      .populate('listingId')
      .populate('userId')
      .sort({ createdAt: -1 })
      .lean() as any[];

    return reservations.map((reservation: any) => ({
      ...reservation,
      id: reservation._id.toString(),
      _id: reservation._id.toString(),
      userId: reservation.userId?._id?.toString() || reservation.userId,
      user: reservation.userId ? {
        ...reservation.userId,
        _id: reservation.userId._id?.toString(),
        id: reservation.userId._id?.toString(),
        createdAt: reservation.userId.createdAt?.toISOString ? reservation.userId.createdAt.toISOString() : null,
        updatedAt: reservation.userId.updatedAt?.toISOString ? reservation.userId.updatedAt.toISOString() : null,
        emailVerified: reservation.userId.emailVerified?.toISOString ? reservation.userId.emailVerified.toISOString() : null,
        favoriteIds: reservation.userId.favoriteIds?.map((favId: any) => favId.toString()) || [],
      } : null,
      listingId: reservation.listingId?._id?.toString() || reservation.listingId,
      createdAt: reservation.createdAt?.toISOString ? reservation.createdAt.toISOString() : (new Date().toISOString()),
      startDate: reservation.startDate?.toISOString ? reservation.startDate.toISOString() : null,
      endDate: reservation.endDate?.toISOString ? reservation.endDate.toISOString() : null,
      listing: reservation.listingId ? {
        ...reservation.listingId,
        id: reservation.listingId._id?.toString(),
        _id: reservation.listingId._id?.toString(),
        createdAt: reservation.listingId.createdAt?.toISOString ? reservation.listingId.createdAt.toISOString() : null,
        userId: reservation.listingId.userId?.toString(),
        rooms: reservation.listingId.rooms ? reservation.listingId.rooms.map((room: any) => ({
          ...room,
          _id: room._id ? room._id.toString() : undefined
        })) : []
      } : null,
      guests: reservation.guests ? reservation.guests.map((guest: any) => ({
        ...guest,
        _id: guest._id ? guest._id.toString() : undefined
      })) : []
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}
