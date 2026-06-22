import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    await connectToDatabase();

    const favorites = await Listing.find({
      _id: { $in: currentUser.favoriteIds || [] }
    }).lean() as any[];

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      id: favorite._id.toString(),
      _id: favorite._id.toString(),
      createdAt: favorite.createdAt.toISOString(),
      rooms: favorite.rooms ? favorite.rooms.map((room: any) => ({
        ...room,
        _id: room._id ? room._id.toString() : undefined
      })) : []
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
