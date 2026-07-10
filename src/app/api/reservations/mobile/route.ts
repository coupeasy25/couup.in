import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { Listing } from "@/models/Listing";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId, listingId, startDate, endDate, totalPrice, basePrice, taxes, roomType, guests, gstState, roomsCount,
      couponCode, couponDiscount
    } = body;

    // We require userId from the mobile app payload since it uses JWT or similar custom auth
    // In a fully secure app, we should verify the mobile app's authentication token here
    if (!userId || !listingId || !startDate || !endDate || !totalPrice) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
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

    const conflictingReservations = await Reservation.find(query);

    const requestedStart = new Date(startDate);
    const requestedEnd = new Date(endDate);
    
    let currentDate = new Date(requestedStart);
    const requestedRooms = roomsCount || 1;
    
    while (currentDate <= requestedEnd) {
      let count = 0;
      
      for (const res of conflictingReservations) {
        const resStart = new Date(res.startDate);
        const resEnd = new Date(res.endDate);
        
        if (currentDate >= resStart && currentDate <= resEnd) {
          count += (res.roomsCount || 1);
        }
      }
      
      if (count + requestedRooms > maxCount) {
        return new NextResponse("These dates are already reserved for this room type", { status: 400 });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Bypass Razorpay logic for mobile
    const reservation = await Reservation.create({
      userId,
      listingId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      basePrice,
      taxes,
      roomType,
      guests,
      gstState,
      roomsCount: roomsCount || 1,
      razorpay_order_id: "mobile_mock_order_" + Date.now(),
      razorpay_payment_id: "mobile_mock_payment_" + Date.now(),
      razorpay_signature: "mobile_mock_signature",
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0
    });

    if (couponCode) {
      try {
        const { Coupon } = require("@/models/Coupon");
        await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { timesUsed: 1 } });
      } catch (err) {
        console.error("Error updating coupon usage:", err);
      }
    }
    try {
      const { generateBookingPDF } = require("@/lib/pdfGenerator");
      const { sendBookingConfirmationEmail } = require("@/lib/mailer");
      const { User } = require("@/models/User");
      
      const user = await User.findById(userId);
      
      if (user && user.email) {
        const pdfBuffer = await generateBookingPDF({
          listingTitle: listing.title,
          locationValue: listing.locationValue,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          basePrice,
          taxes,
          roomType: roomType || 'Standard',
          guests,
          userName: user.name,
          userEmail: user.email,
          paymentId: reservation.razorpay_payment_id,
          orderId: reservation.razorpay_order_id,
          bookingDate: reservation.createdAt
        });

        await sendBookingConfirmationEmail(
          user.email,
          user.name,
          listing.title,
          pdfBuffer
        );
      }
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // We don't fail the booking if the email fails
    }

    return NextResponse.json(reservation, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("MOBILE RESERVATION ERROR:", error);
    return new NextResponse(error.message || "Internal Error", { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
