import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, rating, comment, userId } = body;

    if (!listingId || !rating || !comment || !userId) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    await connectToDatabase();

    const review = await Review.create({
      listingId,
      rating: parseInt(rating, 10),
      comment,
      userId
    });

    return NextResponse.json(review, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("MOBILE_REVIEW_CREATE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
