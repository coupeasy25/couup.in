import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { Listing } from "@/models/Listing";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, startDate, endDate, roomType, roomsCount } = body;

    if (!listingId || !startDate || !endDate) {
      return NextResponse.json({ available: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ available: false, message: "Listing not found" }, { status: 404 });
    }

    // Determine max count for requested roomType or property
    const room = listing.rooms?.find((r: any) => r.type === roomType);
    const maxCount = room ? (room.count || 1) : (listing.roomCount || 1);

    // Find all existing reservations that overlap with the requested dates for this roomType
    const query: any = {
      listingId,
      status: { $ne: 'Cancelled' },
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

    // Check against blocked dates from Listing model
    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    let currentDate = new Date(requestedStart);
    
    while (currentDate <= requestedEnd) {
      // Check if this date is in the blockedDates array
      const isBlocked = listing.blockedDates?.some((bd: Date) => {
        const bDate = new Date(bd);
        return bDate.getDate() === currentDate.getDate() && 
               bDate.getMonth() === currentDate.getMonth() && 
               bDate.getFullYear() === currentDate.getFullYear();
      });
      
      if (isBlocked) {
        return NextResponse.json({ available: false, message: "Selected dates are blocked by the host" });
      }

      let count = 0;
      for (const res of overlappingReservations) {
        const resStart = new Date(res.startDate);
        const resEnd = new Date(res.endDate);
        if (currentDate >= resStart && currentDate <= resEnd) {
          count += (res.roomsCount || 1);
        }
      }
      
      const requestedRooms = roomsCount || 1;
      if (count + requestedRooms > maxCount) {
        return NextResponse.json({ available: false, message: "Not enough rooms available for these dates" });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json({ available: false, message: "Internal server error" }, { status: 500 });
  }
}
