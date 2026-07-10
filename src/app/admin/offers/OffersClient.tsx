"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";

import OfferModal from "@/components/admin/modals/OfferModal";
import { deleteOffer } from "@/actions/admin/offerActions";

interface OffersClientProps {
  offers: any[];
}

const OffersClient: React.FC<OffersClientProps> = ({ offers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [isLoadingId, setIsLoadingId] = useState<string | null>(null);

  const openModal = (offer: any = null) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      setIsLoadingId(id);
      const res = await deleteOffer(id);
      setIsLoadingId(null);
      if (res?.success) {
        toast.success("Offer deleted successfully");
      } else {
        toast.error(res?.error || "Failed to delete offer");
      }
    }
  };

  return (
    <>
      <OfferModal
        isOpen={isModalOpen}
        onClose={closeModal}
        offerToEdit={selectedOffer}
      />
      <div className="w-full flex flex-col gap-6 p-6 md:p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Manage Offers</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Add or edit promotional offers displayed on the home page.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <button
              onClick={() => openModal()}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold rounded-lg transition shadow-sm"
            >
              <Plus size={18} />
              Add New Offer
            </button>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
            <Tag size={48} className="text-neutral-300 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900">No Offers Found</h3>
            <p className="mt-1 max-w-sm">
              You haven't added any promotional offers yet. Click the button above to create your first offer.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                {/* Preview styling mimicking actual card */}
                <div className={`w-full h-[150px] relative p-4 ${offer.bgColor} ${offer.border || ''} flex flex-col justify-between overflow-hidden`}>
                  {/* Full image preview */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={offer.image}
                      alt="Offer Preview"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  
                  {/* Status overlay */}
                  <div className="absolute top-2 right-2 z-20">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between p-3 border-t border-neutral-100 bg-neutral-50">
                  <div className="text-xs text-neutral-500 font-medium">Order: {offer.order}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(offer)}
                      disabled={isLoadingId === offer._id}
                      className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      disabled={isLoadingId === offer._id}
                      className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OffersClient;
