"use client";

import Image from "next/image";
import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";

interface UserClientProps {
  userProfile: any;
  listings: any[];
  currentUser?: any | null;
}

const UserClient: React.FC<UserClientProps> = ({ userProfile, listings, currentUser }) => {
  const isHost = userProfile.isHost;
  const joinDate = userProfile.createdAt ? new Date(userProfile.createdAt).getFullYear() : 'Unknown';

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pt-10 pb-20 flex flex-col gap-12">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#86efac]/20 to-[#0f3d30]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

          {/* Avatar */}
          <div className="relative">
            <Image
              src={userProfile.image || '/placeholder.jpg'}
              alt={userProfile.name || 'User'}
              width={160}
              height={160}
              className="rounded-full object-cover shadow-md border-4 border-white bg-neutral-100 h-40 w-40"
            />
            {/* Role Badge */}
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-sm font-bold tracking-wider text-white shadow-lg uppercase ${isHost ? 'bg-[#0f3d30]' : 'bg-blue-600'}`}>
              {isHost ? 'Host' : 'User'}
            </div>
          </div>

          {/* User Details */}
          <div className="flex flex-col text-center md:text-left pt-2 z-10">
            <h1 className="text-4xl font-bold text-neutral-800">{userProfile.name}</h1>
            <div className="text-neutral-500 mt-2 text-lg">Joined in {joinDate}</div>
            
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-200 flex flex-col items-center md:items-start">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Email Status</span>
                <span className="text-sm font-medium text-neutral-700">{userProfile.emailVerified ? 'Verified ✓' : 'Unverified'}</span>
              </div>
              {isHost && (
                <div className="bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-200 flex flex-col items-center md:items-start">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Properties</span>
                  <span className="text-sm font-medium text-neutral-700">{listings.length} Listings</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Host's Listings Grid */}
        {isHost && listings.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-neutral-800 border-b border-neutral-200 pb-4">
              Properties hosted by {userProfile.name?.split(' ')[0]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {listings.map((listing: any) => (
                <ListingCard
                  currentUser={currentUser}
                  key={listing._id}
                  data={listing}
                />
              ))}
            </div>
          </div>
        )}
        
        {isHost && listings.length === 0 && (
          <div className="flex flex-col gap-4 items-center justify-center py-12 text-neutral-500 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
            <div className="text-lg font-medium">No properties listed yet</div>
            <div>{userProfile.name} hasn't published any listings.</div>
          </div>
        )}

      </div>
    </Container>
  );
}

export default UserClient;
