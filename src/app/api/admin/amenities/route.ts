import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Amenity from "@/models/Amenity";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { name, isQuickFilter, isActive } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const amenity = await Amenity.create({
      name,
      isQuickFilter: isQuickFilter || false,
      isActive: isActive !== false,
    });

    return NextResponse.json(amenity);
  } catch (error: any) {
    console.error("CREATE_AMENITY_ERROR", error);
    if (error.code === 11000) {
      return new NextResponse("Amenity already exists", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
