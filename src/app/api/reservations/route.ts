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

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return NextResponse.error();
  }

  // Determine max count for requested roomType
  const room = listing.rooms?.find((r: any) => r.type === roomType);
  const maxCount = room ? (room.count || 1) : 1;

  // Find all existing reservations that overlap with the requested dates for this roomType
  const query: any = {
    listingId,
    $or: [
      { endDate: { $gte: new Date(startDate) }, startDate: { $lte: new Date(startDate) } },
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(endDate) } },
      { startDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } }
    ]
  };

  if (roomType) {
    query.roomType = roomType;
  }

  const overlappingReservations = await Reservation.find(query);

  // Check if any date in the requested range exceeds maxCount
  const requestedStart = new Date(startDate);
  const requestedEnd = new Date(endDate);
  
  let currentDate = new Date(requestedStart);
  
  while (currentDate <= requestedEnd) {
    let count = 0;
    
    for (const res of overlappingReservations) {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);
      
      // If currentDate falls within the reservation
      if (currentDate >= resStart && currentDate <= resEnd) {
        count++;
      }
    }
    
    if (count >= maxCount) {
      return new NextResponse("Not enough rooms available for these dates", { status: 400 });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
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
