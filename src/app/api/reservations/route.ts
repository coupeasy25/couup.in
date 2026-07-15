import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { Listing } from "@/models/Listing";
import getCurrentUser from "@/actions/getCurrentUser";
import crypto from "crypto";
import { generateBookingPDF } from "@/lib/pdfGenerator";
import { sendBookingConfirmationEmail } from "@/lib/mailer";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { 
    listingId, startDate, endDate, totalPrice, basePrice, taxes, roomType, guests, gstState,
    guestContact, guestEmail,
    razorpay_order_id, razorpay_payment_id, razorpay_signature, roomsCount,
    couponCode, couponDiscount
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
  // ONLY look for non-cancelled reservations
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
      return new NextResponse("Selected dates are blocked by the host", { status: 400 });
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
      return new NextResponse("Not enough rooms available for these dates", { status: 400 });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fetch payment details from Razorpay
  let paymentMethod = 'Unknown';
  let paymentDetails = {};
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
    
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment) {
      paymentMethod = payment.method || 'Unknown';
      if (payment.method === 'card' && payment.card) {
        paymentDetails = {
          network: payment.card.network,
          last4: payment.card.last4,
          issuer: payment.card.issuer,
          name: payment.card.name
        };
      } else if (payment.method === 'upi') {
        paymentDetails = {
          vpa: payment.vpa
        };
      } else if (payment.method === 'netbanking') {
        paymentDetails = {
          bank: payment.bank
        };
      } else if (payment.method === 'wallet') {
         paymentDetails = {
           wallet: payment.wallet
         }
      }
    }
  } catch (err) {
    console.error("Failed to fetch Razorpay payment details:", err);
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
    guestContact: guestContact || (currentUser as any).phone || '',
    guestEmail: guestEmail || currentUser.email || '',
    status: 'Pending',
    gstState: gstState || '',
    roomsCount: roomsCount || 1,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    couponCode: couponCode || null,
    couponDiscount: couponDiscount || 0,
    paymentMethod,
    paymentDetails
  });

  // Automatically create an Invoice for this online booking
  let actualInvoiceNumber = '';
  try {
    const { Invoice } = require("@/models/Invoice");
    const primaryGuest = guests && guests[0] ? `${guests[0].firstName} ${guests[0].lastName}` : (currentUser.name || 'Guest');
    
    const createdInvoice = await Invoice.create({
      type: 'Online',
      reservationId: reservation._id,
      userId: currentUser._id,
      guestName: primaryGuest,
      guestContact: guestContact || (currentUser as any).phone || '',
      guestEmail: guestEmail || currentUser.email || '',
      propertyName: listing.title,
      roomType,
      checkIn: startDate,
      checkOut: endDate,
      amount: basePrice || 0,
      taxes: taxes || 0,
      total: totalPrice,
      paymentMethod: paymentMethod || 'Online',
      status: 'Paid'
    });
    
    actualInvoiceNumber = createdInvoice.invoiceNumber ? `INV-${createdInvoice.invoiceNumber}` : '';
  } catch (invoiceErr) {
    console.error("Failed to generate online invoice:", invoiceErr);
  }

  if (couponCode) {
    try {
      const { Coupon } = require("@/models/Coupon");
      await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { timesUsed: 1 } });
    } catch (err) {
      console.error("Error updating coupon usage:", err);
    }
  }

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
        bookingDate: new Date(),
        actualInvoiceNumber
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
