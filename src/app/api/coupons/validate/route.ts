import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, totalAmount, userId } = body;

    if (!code || !totalAmount) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 400 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, message: "This coupon is no longer active" }, { status: 400 });
    }

    const now = new Date();
    if (now < new Date(coupon.validFrom)) {
      return NextResponse.json({ success: false, message: "This coupon is not valid yet" }, { status: 400 });
    }
    
    if (now > new Date(coupon.validUntil)) {
      return NextResponse.json({ success: false, message: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: "This coupon has reached its global usage limit" }, { status: 400 });
    }

    if (coupon.usageLimitPerUser && userId) {
      const { Reservation } = require("@/models/Reservation");
      const userUsageCount = await Reservation.countDocuments({
        userId,
        couponCode: coupon.code,
        status: { $ne: 'Cancelled' }
      });
      if (userUsageCount >= coupon.usageLimitPerUser) {
        return NextResponse.json({ success: false, message: `You have reached the usage limit for this coupon (${coupon.usageLimitPerUser} times)` }, { status: 400 });
      }
    }

    if (coupon.minBookingAmount && totalAmount < coupon.minBookingAmount) {
      return NextResponse.json({ success: false, message: `Minimum booking amount of ₹${coupon.minBookingAmount} required` }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (totalAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount isn't more than the total amount
    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }

    return NextResponse.json({
      success: true,
      discountAmount,
      couponId: coupon._id,
      message: "Coupon applied successfully"
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    console.error("COUPON_VALIDATE_ERROR", error);
    return NextResponse.json({ success: false, message: "Failed to validate coupon" }, { status: 500 });
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
