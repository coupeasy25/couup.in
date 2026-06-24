"use client";

interface ListingMapProps {
  fullAddress?: string;
  coordinates?: { lat: number; lng: number };
}

const ListingMap: React.FC<ListingMapProps> = ({ fullAddress, coordinates }) => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <h2 className="text-2xl font-semibold">Where you'll be</h2>

      {fullAddress && (
        <div className="p-4 bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl flex flex-col gap-1">
          <div className="font-semibold text-[16px] text-neutral-800">Full Address</div>
          <div className="text-[14px] text-neutral-500">{fullAddress}</div>
          {coordinates && coordinates.lat !== 0 && coordinates.lng !== 0 && (
            <div className="text-[12px] text-neutral-400 mt-1">
              Coordinates: {coordinates.lat}, {coordinates.lng}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingMap;
