"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminBanner, deleteAdminBanner, toggleAdminBannerStatus } from "@/actions/admin/adminBanners";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

interface Banner {
  _id: string;
  imageSrc: string;
  title?: string;
  isActive: boolean;
  order: number;
}

export default function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Image URL is required");
      return;
    }

    setIsLoading(true);
    const res = await createAdminBanner({ imageSrc: imageUrl, title });
    if (res.success) {
      toast.success("Banner created successfully");
      setImageUrl("");
      setTitle("");
      setIsAdding(false);
      router.refresh();
      // Optimistic UI update could go here
    } else {
      toast.error(res.error || "Failed to create banner");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    setIsLoading(true);
    const res = await deleteAdminBanner(id);
    if (res.success) {
      toast.success("Banner deleted");
      setBanners(banners.filter((b) => b._id !== id));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    const res = await toggleAdminBannerStatus(id, !currentStatus);
    if (res.success) {
      toast.success(`Banner ${!currentStatus ? 'activated' : 'deactivated'}`);
      setBanners(banners.map(b => b._id === id ? { ...b, isActive: !currentStatus } : b));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#0f3d30] text-white px-4 py-2 rounded-xl hover:bg-[#0f3d30]/90 transition"
        >
          <Plus size={20} />
          {isAdding ? "Cancel" : "Add New Banner"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm mb-4">
          <h2 className="text-lg font-semibold mb-4">Add New Banner</h2>
          <form onSubmit={handleAddBanner} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#0f3d30] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summer Sale 2026"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#0f3d30] outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#0f3d30] text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">Preview</th>
              <th className="p-4 font-semibold text-neutral-600">Title</th>
              <th className="p-4 font-semibold text-neutral-600">Status</th>
              <th className="p-4 font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4">
                  <div className="w-32 h-16 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                    {banner.imageSrc ? (
                      <img src={banner.imageSrc} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-neutral-400" />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium">{banner.title || "No Title"}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(banner._id, banner.isActive)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      banner.isActive ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(banner._id)}
                    disabled={isLoading}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-500">
                  No banners found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
