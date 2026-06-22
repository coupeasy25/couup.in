import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { User } from "@/models/User";
import { Listing } from "@/models/Listing";

export default async function getAdminPayments() {
  try {
    await connectToDatabase();

    // Fetch reservations that have a razorpay_payment_id
    // This ensures we only show real, successful payments and ignore old test data.
    const payments = await Reservation.find({
      razorpay_payment_id: { $exists: true, $nin: [null, ""] }
    })
      .populate({ path: 'userId', model: User, select: 'name email image' })
      .populate({ path: 'listingId', model: Listing, select: 'title locationValue imageSrc' })
      .sort({ createdAt: -1 })
      .lean();

    const safePayments = payments.map((payment: any) => ({
      ...payment,
      id: payment._id.toString(),
      _id: payment._id.toString(),
      startDate: payment.startDate.toISOString(),
      endDate: payment.endDate.toISOString(),
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt?.toISOString() || null,
      userId: payment.userId ? {
        ...payment.userId,
        id: payment.userId._id.toString(),
        _id: payment.userId._id.toString()
      } : null,
      listingId: payment.listingId ? {
        ...payment.listingId,
        id: payment.listingId._id.toString(),
        _id: payment.listingId._id.toString()
      } : null,
      listing: payment.listingId ? {
        ...payment.listingId,
        id: payment.listingId._id.toString(),
        _id: payment.listingId._id.toString()
      } : null,
      user: payment.userId ? {
        ...payment.userId,
        id: payment.userId._id.toString(),
        _id: payment.userId._id.toString()
      } : null,
      guests: payment.guests ? payment.guests.map((guest: any) => ({
        ...guest,
        _id: guest._id ? guest._id.toString() : undefined
      })) : []
    }));

    return safePayments;
  } catch (error: any) {
    console.error("Error in getAdminPayments:", error);
    return [];
  }
}
