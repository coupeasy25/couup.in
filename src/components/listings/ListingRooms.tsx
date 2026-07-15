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
      <div className="flex flex-col gap-0">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="flex flex-col md:flex-row gap-8 py-8 border-b border-neutral-100 last:border-0 last:pb-0 group/card"
          >
            {/* Image Gallery (Main Image) */}
            <div 
              onClick={() => setViewingRoom(room)}
              className="relative w-full md:w-[240px] h-[180px] bg-neutral-50 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden"
            >
              {room.images?.[0] ? (
                <img 
                  src={room.images[0]} 
                  alt={room.type} 
                  className="w-full h-full object-cover transition-transform duration-700" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-light">
                  No image
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div 
                className="flex flex-col cursor-pointer"
                onClick={() => setViewingRoom(room)}
              >
                <div className="text-[22px] font-medium capitalize text-neutral-900 tracking-tight">{room.type}</div>
                <div className="text-neutral-500 text-[15px] font-light mt-0.5">Up to {room.capacity} guests</div>
                
                {((room.facilities?.length || 0) > 0 || (room.inclusions?.length || 0) > 0) && (
                  <div className="mt-4 text-[14px] text-neutral-500 font-light leading-relaxed max-w-xl line-clamp-2">
                    {[...(room.facilities || []), ...(room.inclusions || [])].join(" • ")}
                  </div>
                )}
              </div>

              <div className="flex flex-row justify-between items-end mt-6">
                <div>
                  <span className="text-xl font-semibold text-neutral-900">₹{room.price}</span>
                  <span className="text-[14px] text-neutral-500 font-light ml-1">night</span>
                </div>
                <button
                  onClick={() => onSelectRoom(room)}
                  className={`px-6 py-2 rounded-full font-medium text-[14px] transition-all duration-200 active:scale-95 ${
                    selectedRoomId === room.id 
                      ? 'bg-neutral-900 text-white shadow-md' 
                      : 'bg-white border border-neutral-300 text-neutral-900 hover:border-neutral-900'
                  }`}
                >
                  {selectedRoomId === room.id ? 'Selected' : 'Select'}
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
