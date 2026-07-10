import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Amenity from "@/models/Amenity";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ amenityId: string }> }
) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    
    // Explicitly destructure allowed fields to prevent arbitrary updates
    const { name, isQuickFilter, isActive } = body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (isQuickFilter !== undefined) updateData.isQuickFilter = isQuickFilter;
    if (isActive !== undefined) updateData.isActive = isActive;

    const resolvedParams = await params;
    const amenity = await Amenity.findByIdAndUpdate(
      resolvedParams.amenityId,
      updateData,
      { new: true }
    );

    if (!amenity) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(amenity);
  } catch (error: any) {
    console.error("UPDATE_AMENITY_ERROR", error);
    if (error.code === 11000) {
      return new NextResponse("Amenity already exists", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ amenityId: string }> }
) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await params;
    const amenity = await Amenity.findByIdAndDelete(resolvedParams.amenityId);

    if (!amenity) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ message: "Amenity deleted successfully" });
  } catch (error: any) {
    console.error("DELETE_AMENITY_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
