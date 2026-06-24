import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { userId, listingId, action } = await request.json();

    if (!userId || !listingId || !action) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let favoriteIds = [...(user.favoriteIds || [])];

    if (action === 'add') {
      if (!favoriteIds.includes(listingId)) {
        favoriteIds.push(listingId);
      }
    } else if (action === 'remove') {
      favoriteIds = favoriteIds.filter((id) => id !== listingId);
    } else {
      return new NextResponse("Invalid action", { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { favoriteIds },
      { new: true }
    ).lean() as any;

    return NextResponse.json({ ...updatedUser, id: updatedUser._id.toString() }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: any) {
    console.error("MOBILE_FAVORITE_TOGGLE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
