import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Listing } from "@/models/Listing";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId?: string }> }
) {
  try {
    const p = await params;
    const { userId } = p;

    if (!userId || typeof userId !== 'string') {
      return new NextResponse("Invalid User ID", { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const favoriteIds = user.favoriteIds || [];

    // Fetch the actual listings
    const favorites = await Listing.find({
      _id: { $in: favoriteIds }
    }).lean();

    // Map `_id` to `id` for consistency
    const safeFavorites = favorites.map((listing: any) => ({
      ...listing,
      id: listing._id.toString(),
      createdAt: listing.createdAt ? listing.createdAt.toISOString() : new Date().toISOString()
    }));

    return NextResponse.json(safeFavorites, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error("MOBILE_FAVORITES_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
