import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";
import { Listing } from "@/models/Listing";
import { User } from "@/models/User";
import { generateBookingPDF } from "@/lib/pdfGenerator";
import { sendBookingConfirmationEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reservationId } = body;

    if (!reservationId) {
      return new NextResponse("Missing reservationId", { status: 400 });
    }

    await connectToDatabase();
    
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return new NextResponse("Reservation not found", { status: 404 });

    const listing = await Listing.findById(reservation.listingId);
    const user = await User.findById(reservation.userId);
    let invoiceNumberStr = '';
    
    try {
      const { Invoice } = require("@/models/Invoice");
      const invoice = await Invoice.findOne({ reservationId });
      if (invoice && invoice.invoiceNumber) {
        invoiceNumberStr = `INV-${invoice.invoiceNumber}`;
      }
    } catch (e) {
      console.log("Invoice not found or error loading model", e);
    }

    if (!listing || !user) return new NextResponse("Listing or User not found", { status: 404 });

    const emailToSendTo = reservation.guestEmail || user.email || '';

    const pdfBuffer = await generateBookingPDF({
      listingTitle: listing.title,
      locationValue: listing.locationValue,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      totalPrice: reservation.totalPrice,
      basePrice: reservation.basePrice,
      taxes: reservation.taxes,
      roomType: reservation.roomType || 'Standard',
      guests: reservation.guests,
      userName: user.name || (reservation.guests && reservation.guests[0] ? `${reservation.guests[0].firstName} ${reservation.guests[0].lastName}` : 'Guest'),
      userEmail: emailToSendTo,
      paymentId: reservation.razorpay_payment_id,
      orderId: reservation.razorpay_order_id,
      bookingDate: reservation.createdAt,
      actualInvoiceNumber: invoiceNumberStr
    });

    await sendBookingConfirmationEmail(
      emailToSendTo,
      user.name || 'Guest',
      listing.title,
      pdfBuffer
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
