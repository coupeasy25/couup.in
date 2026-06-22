import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice, roomType } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  await connectToDatabase();

  // Check for existing reservations that overlap
  const existingReservation = await Reservation.findOne({
    listingId,
    $or: [
      { endDate: { $gte: new Date(startDate) }, startDate: { $lte: new Date(startDate) } },
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(endDate) } }
    ]
  });

  if (existingReservation) {
    return new NextResponse("Listing is already booked for these dates", { status: 400 });
  }

  const reservation = await Reservation.create({
    userId: currentUser._id,
    listingId,
    startDate,
    endDate,
    totalPrice,
    roomType,
  });

  return NextResponse.json(reservation);
}
