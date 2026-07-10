import { NextResponse } from "next/server";
import getListingById from "@/actions/getListingById";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const listing = await getListingById({ listingId: "6a423f07221a15c6a8cd4857" });
    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
