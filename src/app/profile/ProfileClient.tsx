"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

import Container from "@/components/Container";
import Avatar from "@/components/Avatar";
import { User, Mail, ShieldCheck, Check } from "lucide-react";

interface ProfileClientProps {
  currentUser: any;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [age, setAge] = useState<string>(currentUser?.age?.toString() || "");
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || "");

  const hasChanges = 
    name !== currentUser?.name || 
    email !== currentUser?.email || 
    age !== (currentUser?.age?.toString() || "") || 
    mobileNumber !== (currentUser?.mobileNumber || "");

  const onSubmit = () => {
    if (!hasChanges) return;
    
    setIsLoading(true);

    axios.patch('/api/profile', { 
      name, 
      email, 
      age: age ? parseInt(age) : undefined, 
      mobileNumber 
    })
      .then(() => {
        toast.success("Profile updated!");
        router.refresh();
      })
      .catch((error) => {
        toast.error(error.response?.data || "Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-28">
      <Container>
        <div className="max-w-2xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Personal Info</h1>
            <p className="text-neutral-500 text-base">Update your personal details and how we can reach you.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 relative">
              <Avatar src={currentUser?.image} />
              <div className="absolute inset-0 rounded-full border border-black/5" />
            </div>
            <div className="flex flex-col items-center sm:items-start justify-center py-2">
              <h2 className="text-2xl font-bold text-neutral-900 leading-tight">{currentUser?.name}</h2>
              <div className="text-neutral-500 mt-1">{currentUser?.email}</div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 border-b border-neutral-200 focus:outline-none focus:border-[#F97316] transition-colors bg-transparent text-neutral-900 font-medium placeholder:text-neutral-300"
                  placeholder="Your Full Name"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  disabled={isLoading}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 border-b border-neutral-200 focus:outline-none focus:border-[#F97316] transition-colors bg-transparent text-neutral-900 font-medium placeholder:text-neutral-300"
                  placeholder="Your Email Address"
                />
              </div>

              {/* Age */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                  Age
                </label>
                <input
                  disabled={isLoading}
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full py-2 border-b border-neutral-200 focus:outline-none focus:border-[#F97316] transition-colors bg-transparent text-neutral-900 font-medium placeholder:text-neutral-300"
                  placeholder="e.g. 25"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                  Mobile Number
                </label>
                <input
                  disabled={isLoading}
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full py-2 border-b border-neutral-200 focus:outline-none focus:border-[#F97316] transition-colors bg-transparent text-neutral-900 font-medium placeholder:text-neutral-300"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-8 flex justify-end">
              <button 
                disabled={isLoading || !hasChanges || !name.trim() || !email.trim()}
                onClick={onSubmit}
                className="px-10 py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm shadow-[#F97316]/20"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {currentUser?.isHost && (
              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#F97316] bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50">
                <ShieldCheck size={20} className="text-[#F97316]" />
                You are registered as a Host on Couup.
              </div>
            )}
          </div>

        </div>
      </Container>
    </div>
  );
};

export default ProfileClient;
