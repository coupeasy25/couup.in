"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HostEmailVerificationProps {
  currentUser: any;
}

const HostEmailVerification: React.FC<HostEmailVerificationProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/verify-email/send");
      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/verify-email/confirm", { otp });
      toast.success("Email verified successfully!");
      router.refresh(); // This will re-fetch currentUser and re-render page.tsx, bypassing this screen
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full flex flex-col gap-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F97316]">Host Verification</h1>
          <p className="text-neutral-500 mt-2 font-light">
            Before you can list your property, we need to verify your email address.
          </p>
        </div>

        <div className="bg-neutral-100 p-4 rounded-lg">
          <p className="font-medium text-black">{currentUser?.email}</p>
        </div>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={isLoading}
            className="w-full bg-[#F97316] text-[#FFFFFF] font-bold py-4 rounded-xl hover:bg-[#EA580C] transition shadow-md disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-left">
              <Label className="font-semibold text-neutral-700">Enter 6-digit OTP</Label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-bold py-6"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#FFFFFF] text-[#F97316] font-bold py-4 rounded-xl hover:bg-[#F3F4F6] transition shadow-md disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="text-sm font-semibold text-neutral-500 hover:text-black underline transition mt-2"
            >
              Resend Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostEmailVerification;
