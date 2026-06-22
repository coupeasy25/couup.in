"use client";

import Modal from "./Modal";
import { format } from "date-fns";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  if (!payment) return null;

  const {
    listingId,
    userId,
    createdAt,
    totalPrice,
    basePrice,
    taxes,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    gstState
  } = payment;

  const listingTitle = payment.listing?.title || listingId?.title || "Unknown Property";
  const userName = payment.user?.name || userId?.name || "Unknown User";
  const userEmail = payment.user?.email || userId?.email || "Unknown Email";

  const bodyContent = (
    <div className="flex flex-col gap-6">
      
      {/* Razorpay Gateway Info */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl text-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-[#0ea5e9]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span className="font-bold text-[#0369a1]">Razorpay Transaction Info</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-1">
          <span className="font-semibold text-neutral-600">Payment ID:</span>
          <span className="font-mono text-neutral-800 break-all">{razorpay_payment_id || 'N/A'}</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-1">
          <span className="font-semibold text-neutral-600">Order ID:</span>
          <span className="font-mono text-neutral-800 break-all">{razorpay_order_id || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <span className="font-semibold text-neutral-600">Signature:</span>
          <span className="font-mono text-xs text-neutral-500 break-all bg-white p-2 rounded-md border border-neutral-200">
            {razorpay_signature || 'N/A'}
          </span>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg border-b pb-2">Transaction Details</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <span className="font-semibold text-neutral-500 block">Date & Time</span>
            <span className="text-neutral-800">{format(new Date(createdAt), 'dd MMM yyyy, hh:mm a')}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-500 block">Status</span>
            <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded-md text-xs uppercase inline-block">Successful</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-500 block">Total Amount</span>
            <span className="text-xl font-bold text-black">₹{(totalPrice || 0).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-500 block">Breakdown</span>
            <div className="text-neutral-600">Base: ₹{(basePrice || 0).toLocaleString('en-IN')}</div>
            <div className="text-neutral-600">Taxes: ₹{(taxes || 0).toLocaleString('en-IN')}</div>
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-neutral-500 block">GST State</span>
            <span className="text-neutral-800">{gstState || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Booking Context */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg border-b pb-2">Booking Context</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div className="col-span-2">
            <span className="font-semibold text-neutral-500 block">Property / Room</span>
            <span className="text-neutral-800">{listingTitle} {payment.roomType ? `(${payment.roomType})` : ''}</span>
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-neutral-500 block">Paid By User</span>
            <span className="text-neutral-800 font-semibold">{userName}</span>
            <span className="text-neutral-500 text-xs ml-2">({userEmail})</span>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose}
      title="Payment Details"
      actionLabel="Close"
      body={bodyContent}
    />
  );
};

export default PaymentDetailsModal;
