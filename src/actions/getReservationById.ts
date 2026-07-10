import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import mongoose from "mongoose";

interface IParams {
  reservationId?: string;
}

export default async function getReservationById(params: IParams) {
  try {
    await connectToDatabase();
    
    const { reservationId } = params;

    if (!reservationId || !mongoose.Types.ObjectId.isValid(reservationId)) {
      return null;
    }

    const reservation = await Reservation.findById(reservationId)
      .populate('listingId')
      .populate('userId')
      .lean() as any;

    if (!reservation) {
      return null;
    }

    return {
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
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
