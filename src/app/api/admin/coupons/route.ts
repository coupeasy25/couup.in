import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json(coupons);
  } catch (error: any) {
    console.error("COUPON_GET_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    const existingCoupon = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existingCoupon) {
      return new NextResponse("Coupon code already exists", { status: 400 });
    }

    const newCoupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase()
    });

    return NextResponse.json(newCoupon);
  } catch (error: any) {
    console.error("COUPON_POST_ERROR", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
