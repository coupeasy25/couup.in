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

    const users = await User.find().sort({ createdAt: -1 }).lean();
    const listings = await Listing.find().sort({ createdAt: -1 }).lean();
    const reservations = await Reservation.find().sort({ createdAt: -1 }).lean();
    const hosts = await User.find({ isHost: true }).sort({ createdAt: -1 }).lean();

    const safeMap = (items: any[]) => items.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
      userId: item.userId ? item.userId.toString() : null,
      listingId: item.listingId ? item.listingId.toString() : null,
      startDate: item.startDate ? item.startDate.toISOString() : null,
      endDate: item.endDate ? item.endDate.toISOString() : null,
      rooms: item.rooms ? item.rooms.map((room: any) => ({
        ...room,
        _id: room._id ? room._id.toString() : undefined
      })) : undefined,
      guests: item.guests ? item.guests.map((guest: any) => ({
        ...guest,
        _id: guest._id ? guest._id.toString() : undefined
      })) : undefined,
    }));

    return {
      userCount: users.length,
      listingCount: listings.length,
      reservationCount: reservations.length,
      hostCount: hosts.length,
      users: safeMap(users),
      listings: safeMap(listings),
      reservations: safeMap(reservations),
      hosts: safeMap(hosts),
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
