"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: any;
  onSelect: () => void;
  isSelected: boolean;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ isOpen, onClose, room, onSelect, isSelected }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  if (!isOpen || !room) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none bg-neutral-800/70 backdrop-blur-sm">
        <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
          <div className={`translate duration-300 h-full ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px] border-neutral-200">
                <button onClick={onClose} className="p-2 border-0 hover:bg-neutral-100 rounded-full transition absolute left-6">
                  <X size={20} />
                </button>
                <div className="text-xl font-bold">
                  {room.type} Details
                </div>
              </div>

              <div className="relative p-6 flex-auto overflow-y-auto max-h-[65vh]">
                <div className="flex flex-col gap-8">
                  {/* Images */}
                  {room.images && room.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {room.images.map((img: string, index: number) => (
                        <div key={index} className={`relative w-full ${index === 0 && room.images.length % 2 !== 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'} overflow-hidden rounded-xl shadow-sm`}>
                          <img src={img} alt="Room" className="object-cover w-full h-full hover:scale-105 transition duration-500" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="text-2xl font-semibold text-neutral-800">Room Overview</div>
                    <div className="text-lg text-neutral-500 font-light">Capacity: Up to {room.capacity} guests</div>
                    <div className="text-xl text-[#0f3d30] font-bold mt-1">₹{room.price} <span className="text-lg font-normal text-neutral-500">/ night</span></div>
                  </div>

                  {room.facilities?.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="text-xl font-semibold text-neutral-800">Facilities</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {room.facilities.map((fac: string, i: number) => (
                          <span key={i} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg border border-neutral-200 text-sm font-medium">
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {room.inclusions?.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="text-xl font-semibold text-neutral-800">Inclusions</div>
                      <div className="flex flex-col gap-3 mt-1">
                        {room.inclusions.map((inc: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-neutral-700 text-lg">
                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                            {inc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              <div className="flex flex-col p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
                <button
                  onClick={() => {
                    onSelect();
                    onClose();
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-md ${isSelected ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed shadow-none' : 'bg-[#0f3d30] text-[#D4AF37] hover:bg-[#0a2a21] hover:shadow-lg hover:-translate-y-0.5'}`}
                  disabled={isSelected}
                >
                  {isSelected ? "Room Selected" : "Select this room"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetailsModal;
