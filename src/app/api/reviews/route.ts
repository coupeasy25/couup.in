import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, rating, comment } = body;

  if (!listingId || !rating || !comment) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  try {
    await connectToDatabase();

    const review = await Review.create({
      listingId,
      rating: parseInt(rating, 10),
      comment,
      userId: currentUser._id
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("REVIEW_CREATE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
