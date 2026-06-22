import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import getCurrentUser from "@/actions/getCurrentUser";

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ reservationId?: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const p = await params;
  const { reservationId } = p;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  await connectToDatabase();

  const reservation = await Reservation.findOne({ _id: reservationId }).populate('listingId');

  if (!reservation) {
    return new NextResponse('Invalid reservation', { status: 400 });
  }

  // Only the creator of the reservation or the creator of the listing can delete the reservation
  if (
    reservation.userId.toString() !== currentUser._id.toString() &&
    (reservation.listingId as any).userId.toString() !== currentUser._id.toString()
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await Reservation.deleteOne({ _id: reservationId });

  return NextResponse.json(reservation);
}
