import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reservation } from "@/models/Reservation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId?: string }> }
) {
  try {
    const p = await params;
    const { userId } = p;

    if (!userId || typeof userId !== 'string') {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    await connectToDatabase();

    const reservations = await Reservation.find({ userId })
      .populate('listingId')
      .sort({ createdAt: -1 });

    return NextResponse.json(reservations, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("FAILED TO FETCH RESERVATIONS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
