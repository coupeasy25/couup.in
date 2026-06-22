import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Listing } from "@/models/Listing";

interface IParams {
  userId?: string;
}

export default async function getUserById(params: IParams) {
  try {
    const { userId } = params;

    if (!userId || userId.length !== 24) {
      return null;
    }

    await connectToDatabase();

    const user = await User.findById(userId).lean();

    if (!user) {
      return null;
    }

    let listings = [];
    if (user.isHost) {
      listings = await Listing.find({ userId: userId }).lean();
    }

    const safeUser = {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    };

    const safeListings = listings.map((listing: any) => ({
      ...listing,
      _id: listing._id.toString(),
      userId: listing.userId.toString(),
      createdAt: listing.createdAt ? listing.createdAt.toISOString() : null,
      updatedAt: listing.updatedAt ? listing.updatedAt.toISOString() : null,
      rooms: listing.rooms ? listing.rooms.map((room: any) => ({
        ...room,
        _id: room._id ? room._id.toString() : undefined
      })) : undefined,
    }));

    return {
      user: safeUser,
      listings: safeListings
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
