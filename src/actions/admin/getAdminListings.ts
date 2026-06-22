import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { User } from "@/models/User";
import { isAdminAuthenticated } from "./adminAuth";

export default async function getAdminListings() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();

    const listings = await Listing.find()
      .populate({ path: "userId", model: User, select: "name email" })
      .sort({ createdAt: -1 });

    const safeListings = listings.map((listing) => ({
      ...listing.toObject(),
      _id: listing._id.toString(),
      createdAt: listing.createdAt?.toISOString(),
      user: listing.userId ? {
        id: (listing.userId as any)._id?.toString() || (listing.userId as any).id,
        name: (listing.userId as any).name,
        email: (listing.userId as any).email,
      } : null,
      userId: (listing.userId as any)._id?.toString() || (listing.userId as any).id || listing.userId.toString()
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
