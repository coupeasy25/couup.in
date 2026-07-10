import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    await connectToDatabase();

    if (body.code) {
      body.code = body.code.toUpperCase();
      const existing = await Coupon.findOne({ code: body.code, _id: { $ne: id } });
      if (existing) {
        return new NextResponse("Coupon code already exists", { status: 400 });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedCoupon) {
      return new NextResponse("Coupon not found", { status: 404 });
    }

    return NextResponse.json(updatedCoupon);
  } catch (error: any) {
    console.error("COUPON_PUT_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    
    await connectToDatabase();
    
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return new NextResponse("Coupon not found", { status: 404 });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error: any) {
    console.error("COUPON_DELETE_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
