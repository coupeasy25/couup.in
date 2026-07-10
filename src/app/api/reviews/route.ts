import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { Reservation } from "@/models/Reservation";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, rating, comment, guestId, customName } = body;

  if (!listingId || !rating || !comment || (!guestId && !customName)) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  try {
    await connectToDatabase();

    // Verify current user is the host of this listing
    const { Listing } = await import("@/models/Listing");
    const listing = await Listing.findById(listingId);
    
    if (!listing || listing.userId.toString() !== currentUser._id.toString()) {
      return new NextResponse("Unauthorized: Only the host can create reviews.", { status: 403 });
    }

    const reviewData: any = {
      listingId,
      rating: parseInt(rating, 10),
      comment
    };

    if (guestId && guestId !== 'custom') {
      reviewData.userId = guestId;
    }
    if (customName) {
      reviewData.customName = customName;
    }

    const review = await Review.create(reviewData);

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("REVIEW_CREATE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
