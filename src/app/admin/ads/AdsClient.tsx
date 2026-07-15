"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminAdBanner, deleteAdminAdBanner, toggleAdminAdBannerStatus } from "@/actions/admin/adminAdBanners";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/inputs/ImageUpload";

interface AdBanner {
  _id: string;
  imageSrc: string;
  link?: string;
  isActive: boolean;
}

export default function AdsClient({ initialBanners }: { initialBanners: AdBanner[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState<AdBanner[]>(initialBanners);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Image URL is required");
      return;
    }

    setIsLoading(true);
    const res = await createAdminAdBanner({ imageSrc: imageUrl, link });
    if (res.success) {
      toast.success("Ad Banner created successfully");
      setImageUrl("");
      setLink("");
      setIsAdding(false);
      
      if (res.data) {
        setBanners([res.data, ...banners]);
      }
      router.refresh();
    } else {
      toast.error(res.error || "Failed to create ad banner");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad banner?")) return;
    
    setIsLoading(true);
    const res = await deleteAdminAdBanner(id);
    if (res.success) {
      toast.success("Ad Banner deleted");
      setBanners(banners.filter((b) => b._id !== id));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    const res = await toggleAdminAdBannerStatus(id, !currentStatus);
    if (res.success) {
      toast.success(`Ad Banner ${!currentStatus ? 'activated' : 'deactivated'}`);
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
        <div>
          <h1 className="text-2xl font-bold">Ad Banners</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage advertisement banners shown on search result pages</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-xl hover:bg-[#F97316]/90 transition"
        >
          <Plus size={20} />
          {isAdding ? "Cancel" : "Add New Ad"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm mb-4">
          <h2 className="text-lg font-semibold mb-4">Add New Ad Banner</h2>
          <form onSubmit={handleAddBanner} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Image * (Recommended: Wide format like 1200x200)</label>
              <ImageUpload
                value={imageUrl}
                onChange={(value) => setImageUrl(value)}
              />
              {imageUrl && (
                <div className="mt-4 w-full h-32 relative rounded-xl overflow-hidden border border-neutral-200">
                  <img src={imageUrl} alt="Upload" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Destination Link (Optional)</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/promo"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#F97316] text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Ad Banner"}
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
              <th className="p-4 font-semibold text-neutral-600">Link</th>
              <th className="p-4 font-semibold text-neutral-600">Status</th>
              <th className="p-4 font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4">
                  <div className="w-48 h-12 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                    {banner.imageSrc ? (
                      <img src={banner.imageSrc} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-neutral-400" />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium max-w-[200px] truncate text-blue-600 hover:underline">
                  {banner.link ? (
                    <a href={banner.link} target="_blank" rel="noopener noreferrer">{banner.link}</a>
                  ) : "No Link"}
                </td>
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
                  No ad banners found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
