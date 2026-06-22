"use client";

const ListingMap = () => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <h2 className="text-2xl font-semibold">Where you'll be</h2>
      <div className="font-light text-neutral-600 mb-2">City Name, Region, Country</div>
      <div className="w-full h-[450px] bg-neutral-200 rounded-xl relative overflow-hidden">
        {/* Mock Map Placeholder matching screenshot */}
        <div className="w-full h-full bg-[#E4E0D9] flex items-center justify-center relative">
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white p-2 rounded-md shadow-md text-xs font-bold cursor-pointer hover:bg-neutral-50 transition">Zoom In</div>
            <div className="bg-white p-2 rounded-md shadow-md text-xs font-bold cursor-pointer hover:bg-neutral-50 transition">Zoom Out</div>
          </div>
          <div className="w-16 h-16 bg-[#E51D53]/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#E51D53] rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </div>
      <div className="font-semibold underline mt-2 cursor-pointer flex items-center gap-1">Show more</div>
    </div>
  );
};

export default ListingMap;
