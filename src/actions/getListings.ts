import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { Reservation } from "@/models/Reservation";
import mongoose from "mongoose";

export default async function getListings(params: any) {
  try {
    await connectToDatabase();
    
    const { 
      userId,
      roomCount, 
      guestCount, 
      bathroomCount, 
      locationValue,
      startDate,
      endDate
    } = params;

    let query: any = {};

    if (params.status) {
      query.status = params.status;
    } else if (!userId) {
      query.$or = [
        { status: 'APPROVED' },
        { status: { $exists: false } }
      ];
    }

    if (userId) {
      query.userId = userId;
    }

    if (locationValue) {
      // Case-insensitive regex search for location
      query.locationValue = { $regex: new RegExp(locationValue, "i") };
    }

    if (guestCount) {
      query.guestCount = { $gte: +guestCount };
    }

    if (roomCount) {
      query.roomCount = { $gte: +roomCount };
    }

    if (bathroomCount) {
      query.bathroomCount = { $gte: +bathroomCount };
    }

    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      const conflictingReservations = await Reservation.find({
        $or: [
          { endDate: { $gte: parsedStartDate }, startDate: { $lte: parsedStartDate } },
          { startDate: { $lte: parsedEndDate }, endDate: { $gte: parsedEndDate } },
          { startDate: { $gte: parsedStartDate }, endDate: { $lte: parsedEndDate } }
        ]
      }).select('listingId').lean();

      if (conflictingReservations.length > 0) {
        const conflictingListingIds = conflictingReservations.map((res: any) => res.listingId);
        query._id = { $nin: conflictingListingIds };
      }
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 }).lean();

    const listingIds = listings.map((l: any) => l._id);
    const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({
      rating: Number,
      listingId: mongoose.Schema.Types.ObjectId
    }));

    const ratings = await Review.aggregate([
      { $match: { listingId: { $in: listingIds } } },
      { $group: { _id: "$listingId", avgRating: { $avg: "$rating" } } }
    ]);

    const ratingMap = ratings.reduce((acc: any, curr: any) => {
      acc[curr._id.toString()] = curr.avgRating;
      return acc;
    }, {});

    return listings.map((listing: any) => ({
      ...listing,
      id: listing._id.toString(),
      _id: listing._id.toString(),
      createdAt: listing.createdAt.toISOString(),
      userId: listing.userId.toString(),
      averageRating: ratingMap[listing._id.toString()] || null,
      rooms: listing.rooms ? listing.rooms.map((room: any) => ({
        ...room,
        _id: room._id ? room._id.toString() : undefined
      })) : [],
      cancellationRules: listing.cancellationRules ? listing.cancellationRules.map((rule: any) => ({
        ...rule,
        _id: rule._id ? rule._id.toString() : undefined
      })) : []
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}
