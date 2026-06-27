import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import getCurrentUser from "@/actions/getCurrentUser";

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

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

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ reservationId?: string }> }
) {
  const p = await params;
  const { reservationId } = p;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  const body = await request.json();
  const { status, userId } = body;

  const currentUser = await getCurrentUser();
  
  // Accept either session currentUser or mobile userId
  const effectiveUserId = currentUser?._id?.toString() || userId;

  if (!effectiveUserId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!status) {
    return new NextResponse('Missing status', { status: 400 });
  }

  await connectToDatabase();

  const reservation = await Reservation.findOne({ _id: reservationId }).populate('listingId');

  if (!reservation) {
    return new NextResponse('Invalid reservation', { status: 400 });
  }

  // Both the guest and the host can update the reservation status
  const isGuest = reservation.userId.toString() === effectiveUserId;
  const isHost = (reservation.listingId as any).userId.toString() === effectiveUserId;

  if (!isGuest && !isHost) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // A guest can only change the status to 'Cancelled'
  if (isGuest && !isHost && status !== 'Cancelled') {
    return new NextResponse('Guests can only cancel reservations', { status: 403 });
  }

  let updateData: any = { status };

  if (status === 'Cancelled') {
    const listing = reservation.listingId as any;
    const cancellationRules = listing.cancellationRules || [];
    
    if (cancellationRules.length === 0 && listing.cancellationDays !== undefined) {
      cancellationRules.push({ days: listing.cancellationDays, deduction: listing.cancellationDeduction });
    }

    const startDate = new Date(reservation.startDate);
    const today = new Date();
    
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let penalty = 0;
    
    if (cancellationRules.length > 0) {
      const sortedRules = [...cancellationRules].sort((a, b) => a.days - b.days);
      
      let applicableRule = null;
      for (const rule of sortedRules) {
        if (diffDays <= rule.days) {
          applicableRule = rule;
          break;
        }
      }

      if (applicableRule) {
        penalty = (reservation.totalPrice * applicableRule.deduction) / 100;
      }
    }

    updateData.cancellationFee = penalty;
    updateData.refundAmount = reservation.totalPrice - penalty;
    updateData.cancelledAt = new Date();
  }

  const updatedReservation = await Reservation.findOneAndUpdate(
    { _id: reservationId },
    { $set: updateData },
    { new: true }
  );

  return NextResponse.json(updatedReservation, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
