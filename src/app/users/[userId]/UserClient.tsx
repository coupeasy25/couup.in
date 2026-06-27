"use client";

import Image from "next/image";
import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";
import { CheckCircle2, ShieldCheck, Star, MapPin, Building, CalendarDays } from "lucide-react";

interface UserClientProps {
  userProfile: any;
  listings: any[];
  currentUser?: any | null;
}

const UserClient: React.FC<UserClientProps> = ({ userProfile, listings, currentUser }) => {
  const isHost = userProfile.isHost;
  const joinDate = userProfile.createdAt ? new Date(userProfile.createdAt).getFullYear() : 'Unknown';
  
  // Calculate aggregate stats if host
  const totalReviews = listings.reduce((acc, listing) => acc + (listing.reviewCount || 0), 0);
  const avgRating = listings.length > 0 
    ? (listings.reduce((acc, listing) => acc + (listing.averageRating || 0), 0) / listings.filter(l => l.averageRating).length || 0).toFixed(1)
    : "New";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Premium Cover Banner */}
      <div className="relative w-full h-[35vh] min-h-[250px] bg-gradient-to-r from-neutral-100 to-neutral-200 overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[140%] rounded-full bg-gradient-to-bl from-white to-transparent blur-[100px]" />
          <div className="absolute -bottom-[40%] -left-[10%] w-[50%] h-[100%] rounded-full bg-gradient-to-tr from-white to-transparent blur-[80px]" />
        </div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <Container>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-24 sm:-mt-32 relative z-10 flex flex-col gap-10">
          
          {/* Profile Header Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 transition-transform duration-500 hover:shadow-[0_20px_40px_-10px_rgba(15,61,48,0.1)]">
            
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full opacity-50 blur-md group-hover:opacity-70 transition duration-500"></div>
              <div className="relative h-32 w-32 sm:h-48 sm:w-48 rounded-full overflow-hidden border-[6px] border-white shadow-xl bg-neutral-100">
                <Image
                  src={userProfile.image || '/placeholder.jpg'}
                  alt={userProfile.name || 'User'}
                  fill
                  sizes="(max-width: 640px) 128px, 192px"
                  className="object-cover"
                />
              </div>
              {/* Premium Host Badge */}
              {isHost && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#FFFFFF] to-[#F3F4F6] text-white p-2 sm:p-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform hover:scale-110 transition duration-300">
                  <ShieldCheck size={24} className="sm:w-7 sm:h-7" />
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="flex flex-col text-center md:text-left flex-1 w-full pt-2 sm:pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-2">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">{userProfile.name}</h1>
                {userProfile.emailVerified && (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 w-fit mx-auto md:mx-0">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-semibold">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="text-neutral-500 flex items-center justify-center md:justify-start gap-2 text-base sm:text-lg mb-8 font-medium">
                <CalendarDays size={18} className="opacity-70" />
                Joined in {joinDate}
              </div>
              
              {/* Stats Row */}
              {isHost && (
                <div className="grid grid-cols-2 md:flex gap-4 sm:gap-6 mt-auto">
                  <div className="bg-neutral-50/80 backdrop-blur-sm px-5 py-4 rounded-2xl border border-neutral-100 flex flex-col items-center md:items-start transition hover:bg-neutral-100/80">
                    <div className="flex items-center gap-2 mb-1">
                      <Building size={16} className="text-[#F97316]" />
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Properties</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-800">{listings.length}</span>
                  </div>

                  <div className="bg-neutral-50/80 backdrop-blur-sm px-5 py-4 rounded-2xl border border-neutral-100 flex flex-col items-center md:items-start transition hover:bg-neutral-100/80">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={16} className="text-[#FFFFFF]" />
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Avg Rating</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-800">{avgRating}</span>
                  </div>

                  <div className="bg-neutral-50/80 backdrop-blur-sm px-5 py-4 rounded-2xl border border-neutral-100 flex flex-col items-center md:items-start transition hover:bg-neutral-100/80 col-span-2 md:col-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck size={16} className="text-[#F97316]" />
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Reviews</span>
                    </div>
                    <span className="text-2xl font-bold text-neutral-800">{totalReviews}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Host's Listings Grid */}
          {isHost && (
            <div className="flex flex-col gap-8 mt-6">
              <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4">
                <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                  Hosted by {userProfile.name?.split(' ')[0]}
                </h2>
                <span className="text-neutral-500 font-medium hidden sm:block">{listings.length} premium locations</span>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                  {listings.map((listing: any) => (
                    <ListingCard
                      currentUser={currentUser}
                      key={listing._id}
                      data={listing}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-500 bg-white rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFFFFF]/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                  
                  <Building size={64} className="text-neutral-200 mb-6" />
                  <div className="text-2xl font-semibold text-neutral-800 mb-2">No properties yet</div>
                  <div className="text-neutral-500 text-center max-w-sm">
                    {userProfile.name} is currently preparing to list their first premium property. Check back soon.
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </Container>
    </div>
  );
}

export default UserClient;
