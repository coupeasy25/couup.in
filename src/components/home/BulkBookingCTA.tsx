"use client";

import useBulkBookingModal from "@/hooks/useBulkBookingModal";
import { Users, Calendar, ShieldCheck } from "lucide-react";

const BulkBookingCTA = () => {
  const bulkBookingModal = useBulkBookingModal();

  return (
    <div className="w-full bg-white py-10 px-4 md:px-8">
      <div className="max-w-[1350px] mx-auto bg-neutral-50 border border-neutral-200 rounded-[24px] p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 transition-all hover:border-neutral-300">
        
        <div className="flex flex-col gap-5 max-w-3xl">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              Planning a trip for a large group?
            </h2>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl">
              Get customized packages, dedicated support, and exclusive discounts for corporate retreats, weddings, and family reunions.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-full bg-white border border-neutral-200 shadow-sm">
                <Users className="w-4 h-4 text-neutral-700" />
              </div>
              <span className="text-sm font-semibold text-neutral-700">10+ Guests</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-full bg-white border border-neutral-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
              </div>
              <span className="text-sm font-semibold text-neutral-700">Dedicated Support</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-full bg-white border border-neutral-200 shadow-sm">
                <Calendar className="w-4 h-4 text-neutral-700" />
              </div>
              <span className="text-sm font-semibold text-neutral-700">Flexible Dates</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
          <button
            onClick={bulkBookingModal.onOpen}
            className="w-full lg:w-auto px-7 py-3.5 bg-neutral-900 text-white rounded-xl font-medium text-base hover:bg-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Request Custom Quote
          </button>
        </div>

      </div>
    </div>
  );
};

export default BulkBookingCTA;
