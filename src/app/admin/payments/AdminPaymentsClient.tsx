"use client";

import { useState } from "react";
import { format } from "date-fns";
import PaymentDetailsModal from "@/components/modals/PaymentDetailsModal";

interface AdminPaymentsClientProps {
  payments: any[];
}

const AdminPaymentsClient: React.FC<AdminPaymentsClientProps> = ({ payments }) => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  return (
    <>
      <PaymentDetailsModal 
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">All Payments</h2>
        
        {payments.length === 0 ? (
          <div className="text-neutral-500 text-center py-10">No payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Date</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Payment ID</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((payment) => (
                  <tr 
                    key={payment.id} 
                    onClick={() => setSelectedPayment(payment)}
                    className="hover:bg-neutral-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      {format(new Date(payment.createdAt), 'dd MMM yyyy, hh:mm a')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-neutral-800">{payment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-neutral-500">{payment.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-neutral-800 truncate max-w-[200px]">
                        {payment.listing?.title || 'Unknown'}
                      </div>
                      <div className="text-xs text-neutral-500 truncate max-w-[200px]">
                        {payment.listing?.locationValue || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-mono text-xs text-neutral-600">
                        {payment.razorpay_payment_id || <span className="text-red-500">Missing</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-black whitespace-nowrap">
                      ₹{(payment.totalPrice || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPaymentsClient;
