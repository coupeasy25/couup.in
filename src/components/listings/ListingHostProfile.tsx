"use client";

import Avatar from "../Avatar";

interface ListingHostProfileProps {
  user: any;
}

const ListingHostProfile: React.FC<ListingHostProfileProps> = ({ user }) => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <h2 className="text-2xl font-semibold">Meet your Host</h2>
      
      <div className="bg-neutral-100 rounded-3xl p-8 flex flex-col md:flex-row gap-10 items-center md:items-start justify-center shadow-sm">
        
        {/* Host Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center min-w-[300px]">
          <div className="w-24 h-24 relative mb-4">
            <Avatar src={user?.image} />
            <div className="absolute bottom-0 right-0 bg-[#F97316] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">
              🛡️
            </div>
          </div>
          <div className="text-3xl font-bold">{user?.name || 'Host'}</div>
          <div className="font-semibold text-neutral-800">Superhost</div>

          <div className="flex flex-row justify-center gap-8 mt-6 w-full border-t-[1px] border-neutral-200 pt-6">
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-xl">124</span>
              <span className="text-[10px] font-semibold text-neutral-800">Reviews</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-xl flex items-center gap-1">4.88 <span className="text-[14px]">★</span></span>
              <span className="text-[10px] font-semibold text-neutral-800">Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-xl">7</span>
              <span className="text-[10px] font-semibold text-neutral-800">Years hosting</span>
            </div>
          </div>
        </div>

        {/* Host Details */}
        <div className="flex flex-col gap-4 mt-4 max-w-[400px]">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg">{user?.name || 'Host'} is a Superhost</span>
            <span className="font-light text-neutral-600 text-[15px] leading-relaxed">
              Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2 font-light text-neutral-800 text-[15px]">
            <div className="flex items-center gap-3">
              <span>💼</span> My work: Marketing
            </div>
            <div className="flex items-center gap-3">
              <span>🗣️</span> Speaks English, Spanish
            </div>
            <div className="flex items-center gap-3">
              <span>📍</span> Lives in London, UK
            </div>
          </div>
          <div className="mt-6 text-[15px] font-light leading-relaxed">
            I love traveling, meeting new people, and exploring different cultures. I take pride in making my guests feel at home.
          </div>
          <div className="mt-6 border-[1px] border-black rounded-lg px-6 py-3 font-semibold text-black w-max cursor-pointer hover:bg-neutral-100 transition shadow-sm">
            Message Host
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingHostProfile;
