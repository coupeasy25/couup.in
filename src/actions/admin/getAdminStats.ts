import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Listing } from "@/models/Listing";
import { Reservation } from "@/models/Reservation";
import { isAdminAuthenticated } from "./adminAuth";

export default async function getAdminStats() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();

    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const hostCount = await User.countDocuments({ isHost: true });

    return {
      userCount,
      listingCount,
      reservationCount,
      hostCount,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
