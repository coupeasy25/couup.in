"use client";

interface ListingRoomsProps {
  rooms: any[];
  selectedRoomId?: string;
  onSelectRoom: (room: any) => void;
}

const ListingRooms: React.FC<ListingRoomsProps> = ({
  rooms = [],
  selectedRoomId,
  onSelectRoom
}) => {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Available Rooms</h2>
      <div className="flex flex-col gap-6">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="flex flex-col md:flex-row bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Image Gallery (Main Image) */}
            <div className="relative w-full md:w-[320px] h-[240px] md:h-auto bg-neutral-100 flex-shrink-0">
              {room.images?.[0] ? (
                <img 
                  src={room.images[0]} 
                  alt={room.type} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  No image
                </div>
              )}
              {room.images?.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                  1 / {room.images.length}
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold capitalize text-neutral-800">{room.type}</div>
                <div className="text-neutral-500 font-light">Up to {room.capacity} guests</div>
                
                {room.facilities?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.facilities.map((fac: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full">
                        {fac}
                      </span>
                    ))}
                  </div>
                )}
                
                {room.inclusions?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {room.inclusions.map((inc: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[#0f3d30]/10 text-[#0f3d30] text-sm rounded-full font-medium">
                        ✓ {inc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-8 gap-4 border-t border-neutral-100 pt-6">
                <div>
                  <div className="text-3xl font-bold text-neutral-800">
                    ₹{room.price} <span className="text-lg font-normal text-neutral-500">/ night</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectRoom(room)}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedRoomId === room.id 
                      ? 'bg-[#0f3d30] text-white shadow-lg shadow-[#0f3d30]/30 scale-[1.02]' 
                      : 'bg-white border-2 border-[#0f3d30] text-[#0f3d30] hover:bg-[#0f3d30] hover:text-white'
                  }`}
                >
                  {selectedRoomId === room.id ? 'Selected' : 'Select Room'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingRooms;
