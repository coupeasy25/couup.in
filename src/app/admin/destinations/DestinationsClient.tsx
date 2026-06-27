"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminDestination, deleteAdminDestination, toggleAdminDestinationStatus } from "@/actions/admin/adminDestinations";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/inputs/ImageUpload";

interface Destination {
  _id: string;
  imageSrc: string;
  name: string;
  isActive: boolean;
  order: number;
}

export default function DestinationsClient({ initialDestinations }: { initialDestinations: Destination[] }) {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Image URL is required");
      return;
    }
    if (!name) {
      toast.error("Destination Name is required");
      return;
    }

    setIsLoading(true);
    const res = await createAdminDestination({ imageSrc: imageUrl, name });
    if (res.success) {
      toast.success("Destination created successfully");
      setImageUrl("");
      setName("");
      setIsAdding(false);
      router.refresh();
      // Optimistic update
      setDestinations([{ _id: res.id as string, imageSrc: imageUrl, name, isActive: true, order: 0 }, ...destinations]);
    } else {
      toast.error(res.error || "Failed to create destination");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    
    setIsLoading(true);
    const res = await deleteAdminDestination(id);
    if (res.success) {
      toast.success("Destination deleted");
      setDestinations(destinations.filter((d) => d._id !== id));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    const res = await toggleAdminDestinationStatus(id, !currentStatus);
    if (res.success) {
      toast.success(`Destination ${!currentStatus ? 'activated' : 'deactivated'}`);
      setDestinations(destinations.map(d => d._id === id ? { ...d, isActive: !currentStatus } : d));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Destinations Management</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-xl hover:bg-[#F97316]/90 transition"
        >
          <Plus size={20} />
          {isAdding ? "Cancel" : "Add New Destination"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm mb-4">
          <h2 className="text-lg font-semibold mb-4">Add New Destination</h2>
          <form onSubmit={handleAddDestination} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Image *</label>
              <ImageUpload
                value={imageUrl}
                onChange={(value) => setImageUrl(value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Destination Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goa, Ahmedabad"
                className="w-full p-3 border border-neutral-300 rounded-xl outline-none focus:border-[#F97316] transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F97316] text-white font-semibold py-3 rounded-xl hover:bg-[#F97316]/90 transition disabled:opacity-50 mt-2"
            >
              {isLoading ? "Saving..." : "Save Destination"}
            </button>
          </form>
        </div>
      )}

      {destinations.length === 0 && !isAdding ? (
        <div className="bg-white p-12 text-center rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Destinations Found</h3>
          <p className="text-neutral-500 mb-6">Create your first destination to display it on the mobile app.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl hover:bg-[#F97316]/90 transition font-medium"
          >
            <Plus size={20} />
            Add Destination
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <div key={destination._id} className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm group">
              <div className="aspect-video relative overflow-hidden bg-neutral-100">
                {destination.imageSrc ? (
                  <img src={destination.imageSrc} alt="Destination" className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-neutral-400">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {destination.name}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(destination._id, destination.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm transition ${
                      destination.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-neutral-400 hover:bg-neutral-500'
                    }`}
                  >
                    {destination.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center">
                <div className="text-sm font-medium text-neutral-500">
                  Status: <span className={destination.isActive ? "text-green-600 font-bold" : "text-neutral-500"}>
                    {destination.isActive ? "Visible" : "Hidden"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(destination._id)}
                  disabled={isLoading}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  title="Delete Destination"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
