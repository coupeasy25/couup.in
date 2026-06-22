import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import getCurrentUser from "@/actions/getCurrentUser";

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
