import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { otp } = body;

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Re-fetch user to get the latest OTP and expiry
    const user = await User.findById(currentUser._id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.verificationOtp || !user.verificationOtpExpiry) {
      return NextResponse.json({ error: "No OTP requested" }, { status: 400 });
    }

    if (new Date() > new Date(user.verificationOtpExpiry)) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    if (user.verificationOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP is valid
    await User.findByIdAndUpdate(currentUser._id, {
      emailVerified: new Date(),
      $unset: { verificationOtp: 1, verificationOtpExpiry: 1 }
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error: any) {
    console.error("CONFIRM_OTP_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
