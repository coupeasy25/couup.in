import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import getReservations from "@/actions/getReservations";

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ listingId?: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const p = await params;
  const { listingId } = p;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  await connectToDatabase();

  const listing = await Listing.findOneAndDelete({
    _id: listingId,
    userId: currentUser._id
  });

  return NextResponse.json(listing);
}

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ listingId?: string }> }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const p = await params;
  const { listingId } = p;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  const body = await request.json();

  await connectToDatabase();

  const updatedListing = await Listing.findOneAndUpdate(
    { _id: listingId, userId: currentUser._id },
    { $set: body },
    { new: true, runValidators: true }
  );

  if (!updatedListing) {
    return NextResponse.error();
  }

  return NextResponse.json(updatedListing);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ listingId?: string }> }
) {
  try {
    const p = await params;
    const { listingId } = p;

    if (!listingId || typeof listingId !== 'string') {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const listing = await getListingById({ listingId });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const reservations = await getReservations({ listingId });

    // Combine listing and reservations for the mobile client
    const responsePayload = {
      ...listing,
      reservations: reservations || []
    };

    return NextResponse.json(responsePayload, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("GET_LISTING_BY_ID_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
