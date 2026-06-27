import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Listing } from "@/models/Listing";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ listingId: string }> } | { params: { listingId: string } }
) {
  try {
    const isAdmin = await isAdminAuthenticated();
    
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await context.params;
    const { listingId } = resolvedParams;

    if (!listingId) {
      return new NextResponse("Listing ID is required", { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    await connectToDatabase();

    const listing = await Listing.findByIdAndUpdate(
      listingId,
      { status },
      { new: true }
    );

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error: any) {
    console.error("ADMIN_LISTING_UPDATE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
