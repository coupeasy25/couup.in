import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { Listing } from "@/models/Listing";
import getCurrentUser from "@/actions/getCurrentUser";
import crypto from "crypto";
import { generateBookingPDF } from "@/lib/pdfGenerator";
import { sendBookingConfirmationEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    listingId, startDate, endDate, totalPrice, basePrice, taxes, roomType, guests, gstState,
    razorpay_order_id, razorpay_payment_id, razorpay_signature 
  } = body;

  if (!listingId || !startDate || !endDate || !totalPrice || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.error();
  }

  // Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return new NextResponse("Invalid payment signature", { status: 400 });
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
    basePrice: basePrice || 0,
    taxes: taxes || 0,
    totalPrice,
    roomType,
    guests: guests || [],
    gstState: gstState || '',
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  });

  // Generate PDF and Send Email asynchronously (do not block the response)
  const sendConfirmation = async () => {
    try {
      const pdfBuffer = await generateBookingPDF({
        listingTitle: listing.title,
        locationValue: listing.locationValue,
        startDate,
        endDate,
        totalPrice,
        basePrice,
        taxes,
        roomType,
        guests,
        userName: currentUser.name || (guests[0] ? `${guests[0].firstName} ${guests[0].lastName}` : 'Guest'),
        userEmail: currentUser.email,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        bookingDate: new Date()
      });

      await sendBookingConfirmationEmail(
        currentUser.email as string,
        currentUser.name || 'Guest',
        listing.title,
        pdfBuffer
      );
    } catch (err) {
      console.error("Failed to generate PDF or send email", err);
    }
  };

  sendConfirmation();

  return NextResponse.json(reservation);
}
