"use client";

import { Printer, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const InvoiceClient = () => {
  const router = useRouter();

  return (
    <div className="bg-neutral-50 px-8 py-4 border-b border-neutral-200 flex justify-between items-center print:hidden">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <button 
        onClick={() => window.print()} 
        className="flex items-center gap-2 bg-[#F97316] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#EA580C] transition shadow-sm"
      >
        <Printer size={18} /> Print Invoice
      </button>
    </div>
  );
};

export default InvoiceClient;
