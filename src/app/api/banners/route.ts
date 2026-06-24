import { NextResponse } from "next/server";
import Banner from "@/models/Banner";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Only return active banners, sorted by order
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json(banners, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("Error fetching banners:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
