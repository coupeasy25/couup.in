export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Only return active notifications, sorted by newest first
    const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 });
    
    return NextResponse.json(notifications, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
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
