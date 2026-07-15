"use client";

import { useState } from "react";
import { format } from "date-fns";
import CreateOfflineInvoiceModal from "@/components/admin/CreateOfflineInvoiceModal";
import Link from "next/link";
import { Plus } from "lucide-react";

interface InvoicesClientProps {
  initialInvoices: any[];
}

const InvoicesClient: React.FC<InvoicesClientProps> = ({ initialInvoices }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Invoices</h1>
          <p className="text-neutral-500 mt-1">Manage all online and offline invoices</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F97316] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#EA580C] transition flex items-center gap-2"
        >
          <Plus size={20} />
          Create Offline Invoice
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left text-neutral-500 border-collapse">
          <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-tl-lg font-bold">Inv #</th>
              <th scope="col" className="px-6 py-4 font-bold">Type</th>
              <th scope="col" className="px-6 py-4 font-bold">Guest</th>
              <th scope="col" className="px-6 py-4 font-bold">Property</th>
              <th scope="col" className="px-6 py-4 font-bold">Total</th>
              <th scope="col" className="px-6 py-4 font-bold">Date</th>
              <th scope="col" className="px-6 py-4 rounded-tr-lg font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {initialInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-neutral-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              initialInvoices.map((invoice) => (
                <tr key={invoice._id} className="bg-white border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">
                    INV-{invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      invoice.type === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {invoice.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-700">
                    {invoice.guestName}
                    <div className="text-xs font-normal text-neutral-400">{invoice.guestContact || invoice.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    {invoice.propertyName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">
                    ₹{invoice.total?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {format(new Date(invoice.createdAt), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/invoice/${invoice._id}`}
                      target="_blank"
                      className="text-[#F97316] hover:underline font-semibold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateOfflineInvoiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default InvoicesClient;
