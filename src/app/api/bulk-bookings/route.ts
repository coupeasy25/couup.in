import { NextResponse } from "next/server";
import BulkBooking from "@/models/BulkBooking";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, destination, numberOfGuests, expectedDate, notes } = body;

    if (!name || !email || !phone) {
      return new NextResponse("Name, email and phone are required", { status: 400 });
    }

    const newBooking = new BulkBooking({
      name,
      email,
      phone,
      destination,
      numberOfGuests,
      expectedDate,
      notes,
    });

    await newBooking.save();

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("BULK_BOOKING_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
