import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { User } from "@/models/User";
import { Listing } from "@/models/Listing";
import { isAdminAuthenticated } from "./adminAuth";

export default async function getAdminCancellations() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();

    const reservations = await Reservation.find({ status: 'Cancelled' })
      .populate({ path: "userId", model: User, select: "name email" })
      .populate({ path: "listingId", model: Listing, select: "title price userId" })
      .sort({ cancelledAt: -1, createdAt: -1 });

    const safeReservations = reservations.map((reservation) => ({
      ...reservation.toObject(),
      _id: reservation._id.toString(),
      createdAt: reservation.createdAt?.toISOString(),
      cancelledAt: reservation.cancelledAt?.toISOString() || reservation.updatedAt?.toISOString() || reservation.createdAt?.toISOString(),
      startDate: reservation.startDate?.toISOString(),
      endDate: reservation.endDate?.toISOString(),
      user: reservation.userId ? {
        id: (reservation.userId as any)._id?.toString(),
        name: (reservation.userId as any).name,
        email: (reservation.userId as any).email,
      } : null,
      listing: reservation.listingId ? {
        id: (reservation.listingId as any)._id?.toString(),
        title: (reservation.listingId as any).title,
        price: (reservation.listingId as any).price,
        userId: (reservation.listingId as any).userId?.toString(),
      } : null,
      userId: (reservation.userId as any)._id?.toString() || reservation.userId.toString(),
      listingId: (reservation.listingId as any)._id?.toString() || reservation.listingId.toString(),
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
