"use client";

import { useState } from "react";
import RoomDetailsModal from "../modals/RoomDetailsModal";

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
  const [viewingRoom, setViewingRoom] = useState<any>(null);

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
            <div 
              onClick={() => setViewingRoom(room)}
              className="relative w-full md:w-[320px] h-[240px] md:h-auto bg-neutral-100 flex-shrink-0 cursor-pointer group"
            >
              {room.images?.[0] ? (
                <img 
                  src={room.images[0]} 
                  alt={room.type} 
                  className="w-full h-full object-cover transition duration-500" 
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-black px-4 py-2 rounded-full text-sm font-semibold transition duration-300 shadow-md">
                  View Details
                </span>
              </div>
            </div>

            {/* Room Info */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div 
                className="flex flex-col gap-2 cursor-pointer"
                onClick={() => setViewingRoom(room)}
              >
                <div className="text-2xl font-semibold capitalize text-neutral-800 hover:underline">{room.type}</div>
                <div className="text-neutral-500 font-light">Up to {room.capacity} guests</div>
                
                {room.facilities?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.facilities.slice(0, 3).map((fac: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full">
                        {fac}
                      </span>
                    ))}
                    {room.facilities.length > 3 && (
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-full font-medium">
                        +{room.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                {room.inclusions?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {room.inclusions.slice(0, 2).map((inc: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] text-sm rounded-full font-medium">
                        ✓ {inc}
                      </span>
                    ))}
                    {room.inclusions.length > 2 && (
                      <span className="px-3 py-1 text-neutral-500 text-sm font-medium underline">
                        +{room.inclusions.length - 2} more
                      </span>
                    )}
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
                      ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/30 scale-[1.02]' 
                      : 'bg-white border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white'
                  }`}
                >
                  {selectedRoomId === room.id ? 'Selected' : 'Select Room'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RoomDetailsModal
        isOpen={!!viewingRoom}
        onClose={() => setViewingRoom(null)}
        room={viewingRoom}
        onSelect={() => onSelectRoom(viewingRoom)}
        isSelected={selectedRoomId === viewingRoom?.id}
      />
    </div>
  );
};

export default ListingRooms;
