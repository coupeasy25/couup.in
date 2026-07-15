"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { createManualInvoice } from "@/actions/invoiceActions";
import { X } from "lucide-react";

interface CreateOfflineInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateOfflineInvoiceModal: React.FC<CreateOfflineInvoiceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestContact: '',
    guestEmail: '',
    propertyName: '',
    roomType: '',
    amount: '',
    taxes: '',
    total: '',
    paymentMethod: 'Cash',
    checkIn: '',
    checkOut: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      taxes: Number(formData.taxes),
      total: Number(formData.total),
      checkIn: formData.checkIn ? new Date(formData.checkIn) : undefined,
      checkOut: formData.checkOut ? new Date(formData.checkOut) : undefined,
    };

    const res = await createManualInvoice(payload);

    if (res.success) {
      toast.success("Offline Invoice created!");
      onClose();
      // Optionally open the invoice in a new tab:
      // window.open(`/invoice/${res.invoice._id}`, '_blank');
      setFormData({
        guestName: '',
        guestContact: '',
        guestEmail: '',
        propertyName: '',
        roomType: '',
        amount: '',
        taxes: '',
        total: '',
        paymentMethod: 'Cash',
        checkIn: '',
        checkOut: ''
      });
    } else {
      toast.error(res.error || "Failed to create invoice");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Create Offline Invoice</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition">
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Guest Name *</label>
                <input required name="guestName" value={formData.guestName} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" placeholder="e.g. John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Guest Contact</label>
                <input name="guestContact" value={formData.guestContact} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" placeholder="+91 9876543210" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-neutral-700">Property / Hotel Name *</label>
                <input required name="propertyName" value={formData.propertyName} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" placeholder="e.g. Grand Resort" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Check In Date</label>
                <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Check Out Date</label>
                <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Base Amount (₹) *</label>
                <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" placeholder="0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Taxes (₹) *</label>
                <input required type="number" name="taxes" value={formData.taxes} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" placeholder="0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Total (₹) *</label>
                <input required type="number" name="total" value={formData.total} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]" placeholder="0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="p-3 border border-neutral-300 rounded-lg outline-none focus:border-[#F97316]">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-6 py-3 font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition">Cancel</button>
              <button disabled={isLoading} type="submit" className="px-6 py-3 font-bold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg transition disabled:opacity-50">
                {isLoading ? "Creating..." : "Generate Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOfflineInvoiceModal;
