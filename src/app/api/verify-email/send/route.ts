import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import getCurrentUser from "@/actions/getCurrentUser";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!currentUser.email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    await connectToDatabase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await User.findByIdAndUpdate(currentUser._id, {
      verificationOtp: otp,
      verificationOtpExpiry: otpExpiry,
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing EMAIL_USER or EMAIL_PASS in environment variables. OTP was generated but email cannot be sent.");
      console.log(`[DEVELOPMENT ONLY] Your OTP is: ${otp}`);
      // Return 500 so frontend knows it failed, or we can just send the OTP in dev.
      // But it's better to return a specific error that frontend can show or just fail gracefully.
      return NextResponse.json({ error: "Email configuration missing on the server. If you are in development, check your terminal for the OTP." }, { status: 500 });
    }

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: currentUser.email,
      subject: "Couup Host Verification - Your OTP",
      text: `Your OTP for Host Verification is: ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Host Email Verification</h2>
          <p>Thank you for choosing to become a host on Couup.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #F97316; letter-spacing: 2px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("SEND_OTP_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
