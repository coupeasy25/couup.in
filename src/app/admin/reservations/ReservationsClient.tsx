"use client";

import { useState } from "react";

interface ReservationsClientProps {
  reservations: any[];
}

export default function ReservationsClient({ reservations }: ReservationsClientProps) {
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  const handleRowClick = (reservation: any) => {
    setSelectedReservation(reservation);
  };

  const closeModal = () => {
    setSelectedReservation(null);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            <th className="p-4 font-semibold text-neutral-600">ID</th>
            <th className="p-4 font-semibold text-neutral-600">Listing</th>
            <th className="p-4 font-semibold text-neutral-600">Guest</th>
            <th className="p-4 font-semibold text-neutral-600">Dates</th>
            <th className="p-4 font-semibold text-neutral-600">Coupon</th>
            <th className="p-4 font-semibold text-neutral-600">Total Price</th>
            <th className="p-4 font-semibold text-neutral-600">Booked On</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr 
              key={reservation._id} 
              className="border-b border-neutral-100 hover:bg-neutral-50 transition cursor-pointer"
              onClick={() => handleRowClick(reservation)}
            >
              <td className="p-4 text-sm text-neutral-500 font-mono">{reservation._id.substring(0, 8)}...</td>
              <td className="p-4 font-medium">{reservation.listing?.title || "Unknown"}</td>
              <td className="p-4">{reservation.user?.name || "Unknown"}</td>
              <td className="p-4">
                {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
              </td>
              <td className="p-4">
                {reservation.couponCode ? (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-200">
                    {reservation.couponCode}
                  </span>
                ) : (
                  <span className="text-neutral-400 text-sm">-</span>
                )}
              </td>
              <td className="p-4 font-semibold text-rose-500">₹{reservation.totalPrice}</td>
              <td className="p-4 text-neutral-500">
                {new Date(reservation.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {reservations.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-neutral-500">
                No reservations found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Reservation Details</h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500 block text-sm">ID</span>
                    <span className="font-mono">{selectedReservation._id}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Status</span>
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{selectedReservation.status || 'Confirmed'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Hotel/Listing</span>
                    <span className="font-medium">{selectedReservation.listing?.title || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Booked On</span>
                    <span>{new Date(selectedReservation.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Check-in</span>
                    <span>{new Date(selectedReservation.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Check-out</span>
                    <span>{new Date(selectedReservation.endDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Room Type</span>
                    <span>{selectedReservation.roomType || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Rooms Count</span>
                    <span>{selectedReservation.roomsCount || 1}</span>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-3">Guest Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500 block text-sm">Primary Guest</span>
                    <span>{selectedReservation.user?.name || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Email</span>
                    <span>{selectedReservation.guestEmail || selectedReservation.user?.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-sm">Contact</span>
                    <span>{selectedReservation.guestContact || "N/A"}</span>
                  </div>
                </div>
                
                {selectedReservation.guests && selectedReservation.guests.length > 0 && (
                  <div className="mt-4">
                    <span className="text-neutral-500 block text-sm mb-2">All Guests:</span>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                      {selectedReservation.guests.map((g: any, i: number) => (
                        <li key={i}>{g.firstName} {g.lastName} ({g.age} yrs, {g.gender})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Payment & Coupon */}
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-3">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Base Price:</span>
                    <span>₹{selectedReservation.basePrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Taxes & Fees:</span>
                    <span>₹{selectedReservation.taxes || 0}</span>
                  </div>
                  
                  {selectedReservation.couponCode && (
                    <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded-md">
                      <span>Coupon Applied ({selectedReservation.couponCode}):</span>
                      <span>-₹{selectedReservation.couponDiscount || 0}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total Paid:</span>
                    <span className="text-rose-500">₹{selectedReservation.totalPrice}</span>
                  </div>
                  
                  {selectedReservation.razorpay_payment_id && (
                    <div className="mt-4 pt-4 border-t space-y-1 text-sm text-neutral-600">
                      <div className="flex justify-between">
                        <span>Razorpay Payment ID:</span>
                        <span className="font-mono">{selectedReservation.razorpay_payment_id}</span>
                      </div>
                      
                      {selectedReservation.paymentMethod && (
                        <div className="flex justify-between font-medium text-black mt-2">
                          <span>Method:</span>
                          <span className="uppercase">{selectedReservation.paymentMethod}</span>
                        </div>
                      )}
                      
                      {selectedReservation.paymentDetails && selectedReservation.paymentMethod === 'card' && (
                        <div className="bg-neutral-50 p-3 rounded-md mt-2 border border-neutral-100">
                          <p className="font-semibold text-xs text-neutral-500 uppercase tracking-wider mb-2">Card Details</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-neutral-500">Network:</span>
                            <span className="font-medium capitalize">{selectedReservation.paymentDetails.network}</span>
                            <span className="text-neutral-500">Card Number:</span>
                            <span className="font-medium">**** **** **** {selectedReservation.paymentDetails.last4}</span>
                            {selectedReservation.paymentDetails.name && (
                              <>
                                <span className="text-neutral-500">Name on Card:</span>
                                <span className="font-medium">{selectedReservation.paymentDetails.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedReservation.paymentDetails && selectedReservation.paymentMethod === 'upi' && (
                        <div className="bg-neutral-50 p-3 rounded-md mt-2 border border-neutral-100">
                          <p className="font-semibold text-xs text-neutral-500 uppercase tracking-wider mb-2">UPI Details</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">UPI ID (VPA):</span>
                            <span className="font-medium">{selectedReservation.paymentDetails.vpa}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-neutral-50 flex justify-end sticky bottom-0">
              <button 
                onClick={closeModal}
                className="bg-neutral-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-neutral-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
