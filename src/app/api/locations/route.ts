export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get all unique locationValue entries from the Listing collection
    const locations = await Listing.distinct("locationValue");
    
    return NextResponse.json(locations);
  } catch (error: any) {
    console.error("LOCATIONS_GET_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
