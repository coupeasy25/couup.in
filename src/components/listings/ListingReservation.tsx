"use client";

import { useState } from "react";
import { Range } from "react-date-range";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Calendar from "../inputs/Calendar";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
  guestCount?: number;
  selectedRoomName?: string;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  guestCount = 1,
  selectedRoomName
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const nights = Math.max(1, totalPrice / price);
  const serviceFee = 10; // Fixed 10 rupee Couup fee
  const total = totalPrice + serviceFee;

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 shadow-xl p-6 relative">
      <div className="flex flex-row items-baseline gap-1 mb-6">
        <span className="text-2xl font-bold text-black">₹{price.toLocaleString('en-IN')}</span>
        <span className="font-light text-neutral-600 text-[15px]">night</span>
      </div>

      <div className="relative">
        <div className="border-[1px] border-neutral-400 rounded-lg overflow-hidden mb-4">
          <div className="flex flex-row items-center w-full border-b-[1px] border-neutral-400">
            <div 
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-1/2 p-3 flex flex-col justify-center border-r-[1px] border-neutral-400 cursor-pointer hover:bg-neutral-50 transition"
            >
              <span className="text-[10px] font-extrabold text-black uppercase">Check-in</span>
              <span className="text-sm font-light text-neutral-600">
                {dateRange.startDate ? format(dateRange.startDate, 'dd/MM/yyyy') : 'Add date'}
              </span>
            </div>
            <div 
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-1/2 p-3 flex flex-col justify-center cursor-pointer hover:bg-neutral-50 transition"
            >
              <span className="text-[10px] font-extrabold text-black uppercase">Checkout</span>
              <span className="text-sm font-light text-neutral-600">
                {dateRange.endDate ? format(dateRange.endDate, 'dd/MM/yyyy') : 'Add date'}
              </span>
            </div>
          </div>
          <div className="w-full p-3 flex flex-col justify-center cursor-pointer hover:bg-neutral-50 transition">
            <span className="text-[10px] font-extrabold text-black uppercase">Guests</span>
            <span className="text-sm font-light text-neutral-800">{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</span>
          </div>
        </div>

        {/* Dropdown Calendar */}
        {showCalendar && (
          <div className="absolute top-full left-[-20px] md:left-auto md:right-[-20px] z-50 bg-white shadow-2xl border-[1px] border-neutral-200 rounded-2xl p-4 mt-2">
            <Calendar
              value={dateRange}
              disabledDates={disabledDates}
              onChange={(value) => onChangeDate(value.selection)}
            />
            <div className="w-full flex justify-end mt-4">
              <button 
                onClick={() => setShowCalendar(false)}
                className="underline font-semibold text-black hover:bg-neutral-100 px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Button 
        disabled={disabled} 
        onClick={onSubmit}
        className="w-full bg-[#0f3d30] hover:bg-[#0a2a21] text-[#D4AF37] font-bold py-6 text-lg rounded-lg transition"
      >
        Reserve
      </Button>

      <div className="text-center font-light text-neutral-500 mt-4 text-[13px]">
        You won't be charged yet
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {selectedRoomName && (
          <div className="flex flex-row items-center justify-between font-light text-neutral-600 text-[15px]">
            <div>Selected Room</div>
            <div className="text-neutral-800 font-medium text-right max-w-[200px] truncate">{selectedRoomName}</div>
          </div>
        )}
        <div className="flex flex-row items-center justify-between font-light text-neutral-600 underline decoration-1 text-[15px]">
          <div>₹{price.toLocaleString('en-IN')} x {nights} nights</div>
          <div className="no-underline text-neutral-800">₹{totalPrice.toLocaleString('en-IN')}</div>
        </div>
        <div className="flex flex-row items-center justify-between font-light text-neutral-600 underline decoration-1 text-[15px]">
          <div>Couup service fee</div>
          <div className="no-underline text-neutral-800">₹{serviceFee.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <hr className="my-6 border-neutral-200" />

      <div className="flex flex-row items-center justify-between font-semibold text-lg text-neutral-800">
        <div>Total before taxes</div>
        <div>₹{total.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
