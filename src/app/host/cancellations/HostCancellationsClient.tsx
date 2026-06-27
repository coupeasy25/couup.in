"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ReservationDetailsModal from "@/components/modals/ReservationDetailsModal";
import { useState } from "react";

interface HostCancellationsClientProps {
  cancellations: any[];
}

const HostCancellationsClient: React.FC<HostCancellationsClientProps> = ({
  cancellations,
}) => {
  const router = useRouter();
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  return (
    <>
      <ReservationDetailsModal 
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        reservation={selectedReservation}
      />
      <div className="flex flex-col gap-8">
        <div className="flex flex-row items-start gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 mt-[-4px] rounded-full hover:bg-neutral-100 transition cursor-pointer">
            <ChevronLeft size={28} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-1">Cancelled Bookings</h2>
            <div className="font-light text-neutral-500">View bookings that have been cancelled by guests or you.</div>
          </div>
        </div>
        
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 font-semibold text-neutral-600">ID</th>
                <th className="p-4 font-semibold text-neutral-600">Property</th>
                <th className="p-4 font-semibold text-neutral-600">Guest</th>
                <th className="p-4 font-semibold text-neutral-600">Cancelled Date</th>
                <th className="p-4 font-semibold text-neutral-600">Original Price</th>
                <th className="p-4 font-semibold text-neutral-600">Penalty / Fee</th>
                <th className="p-4 font-semibold text-neutral-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {cancellations.map((reservation) => (
                <tr 
                  key={reservation.id} 
                  className="border-b border-neutral-100 hover:bg-neutral-50 transition cursor-pointer"
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <td className="p-4 text-sm text-neutral-500 font-mono">{reservation.id.substring(0, 8)}...</td>
                  <td className="p-4 font-medium">{reservation.listing?.title || "Unknown"}</td>
                  <td className="p-4">{reservation.user?.name || "Unknown"}</td>
                  <td className="p-4 text-neutral-500">
                    {new Date(reservation.cancelledAt || reservation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold text-neutral-600">₹{reservation.totalPrice}</td>
                  <td className="p-4 font-semibold text-rose-500">₹{reservation.cancellationFee || 0}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-semibold">Cancelled</span>
                  </td>
                </tr>
              ))}
              {cancellations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    No cancellations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HostCancellationsClient;
