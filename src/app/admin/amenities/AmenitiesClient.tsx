"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit } from "lucide-react";

interface Amenity {
  _id: string;
  name: string;
  isQuickFilter: boolean;
  isActive: boolean;
}

interface AmenitiesClientProps {
  initialAmenities: Amenity[];
}

export default function AmenitiesClient({ initialAmenities }: AmenitiesClientProps) {
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [isQuickFilter, setIsQuickFilter] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const router = useRouter();

  const resetForm = () => {
    setName("");
    setIsQuickFilter(false);
    setIsActive(true);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (amenity: Amenity) => {
    setName(amenity.name);
    setIsQuickFilter(amenity.isQuickFilter);
    setIsActive(amenity.isActive);
    setEditingId(amenity._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { name, isQuickFilter, isActive };

      if (editingId) {
        await axios.patch(`/api/admin/amenities/${editingId}`, payload);
        toast.success("Amenity updated!");
        
        // Update local state
        setAmenities(prev => 
          prev.map(a => a._id === editingId ? { ...a, ...payload } : a)
        );
      } else {
        const res = await axios.post("/api/admin/amenities", payload);
        toast.success("Amenity added!");
        
        // Add to local state
        setAmenities(prev => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      
      closeModal();
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this amenity?")) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`/api/admin/amenities/${id}`);
      toast.success("Amenity deleted");
      setAmenities(prev => prev.filter(a => a._id !== id));
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActiveStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/amenities/${id}`, { isActive: !currentActiveStatus });
      setAmenities(prev => 
        prev.map(a => a._id === id ? { ...a, isActive: !currentActiveStatus } : a)
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Amenities & Filters</h1>
          <p className="text-neutral-500 mt-1">Manage filters available for users on the search page.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-800 transition"
        >
          <Plus size={18} />
          Add Amenity
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">Name</th>
              <th className="p-4 font-semibold text-neutral-600">Quick Filter Bar</th>
              <th className="p-4 font-semibold text-neutral-600">Status</th>
              <th className="p-4 font-semibold text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {amenities.map((amenity) => (
              <tr key={amenity._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4 font-medium">{amenity.name}</td>
                <td className="p-4">
                  {amenity.isQuickFilter ? (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Visible
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold">
                      Popup Only
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleToggleActive(amenity._id, amenity.isActive)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                      amenity.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {amenity.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button 
                    onClick={() => openEditModal(amenity)}
                    className="p-2 text-neutral-500 hover:bg-neutral-200 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(amenity._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {amenities.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">
                  No amenities found. Click "Add Amenity" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <form onSubmit={onSubmit}>
              <div className="flex justify-between items-center p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Amenity' : 'Add Amenity'}
                </h2>
                <button 
                  type="button"
                  onClick={closeModal}
                  className="p-2 hover:bg-neutral-100 rounded-full transition"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">Amenity Name (e.g. Wifi, Pool)</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg p-3 outline-none focus:border-black"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition">
                  <input 
                    type="checkbox" 
                    checked={isQuickFilter}
                    onChange={(e) => setIsQuickFilter(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-black rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Show as Quick Filter</span>
                    <span className="text-xs text-neutral-500">If checked, this will appear on the horizontal bar above search results.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 accent-black rounded"
                  />
                  <span className="font-semibold text-sm">Active (visible to users)</span>
                </label>
              </div>

              <div className="p-6 border-t border-neutral-200 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-neutral-300 rounded-lg font-semibold hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading || !name}
                  className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
