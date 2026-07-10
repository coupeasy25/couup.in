"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Tag, X } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minBookingAmount: "",
    maxDiscount: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
    usageLimit: "",
    usageLimitPerUser: ""
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get("/api/admin/coupons");
      setCoupons(response.data);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (coupon: any = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minBookingAmount: coupon.minBookingAmount ? coupon.minBookingAmount.toString() : "",
        maxDiscount: coupon.maxDiscount ? coupon.maxDiscount.toString() : "",
        validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
        validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
        isActive: coupon.isActive,
        usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
        usageLimitPerUser: coupon.usageLimitPerUser ? coupon.usageLimitPerUser.toString() : ""
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minBookingAmount: "",
        maxDiscount: "",
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        isActive: true,
        usageLimit: "",
        usageLimitPerUser: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minBookingAmount: formData.minBookingAmount ? Number(formData.minBookingAmount) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        usageLimitPerUser: formData.usageLimitPerUser ? Number(formData.usageLimitPerUser) : null,
      };

      if (editingCoupon) {
        await axios.put(`/api/admin/coupons/${editingCoupon._id}`, payload);
        toast.success("Coupon updated successfully");
      } else {
        await axios.post("/api/admin/coupons", payload);
        toast.success("Coupon created successfully");
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data || "Failed to save coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`/api/admin/coupons/${id}`);
        toast.success("Coupon deleted");
        fetchCoupons();
      } catch (error) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  const toggleStatus = async (coupon: any) => {
    try {
      await axios.put(`/api/admin/coupons/${coupon._id}`, {
        isActive: !coupon.isActive
      });
      toast.success(`Coupon marked as ${!coupon.isActive ? 'Active' : 'Inactive'}`);
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Coupons Management</h1>
          <p className="text-neutral-500">Create and manage discount codes</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">Code</th>
              <th className="p-4 font-semibold text-neutral-600">Discount</th>
              <th className="p-4 font-semibold text-neutral-600">Validity</th>
              <th className="p-4 font-semibold text-neutral-600">Usage</th>
              <th className="p-4 font-semibold text-neutral-600">Status</th>
              <th className="p-4 font-semibold text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-neutral-500">Loading coupons...</td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-neutral-500">
                  <Tag className="mx-auto mb-3 text-neutral-300" size={32} />
                  No coupons found. Create one to get started!
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                  <td className="p-4">
                    <span className="font-bold text-lg text-neutral-800 bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200">
                      {coupon.code}
                    </span>
                    {coupon.minBookingAmount > 0 && (
                      <div className="text-xs text-neutral-500 mt-2">Min order: ₹{coupon.minBookingAmount}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-green-600">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </div>
                    {coupon.discountType === 'percentage' && coupon.maxDiscount && (
                      <div className="text-xs text-neutral-500 mt-1">Up to ₹{coupon.maxDiscount}</div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-neutral-600">
                    <div>{new Date(coupon.validFrom).toLocaleDateString('en-GB')}</div>
                    <div className="text-xs text-neutral-400">to</div>
                    <div>{new Date(coupon.validUntil).toLocaleDateString('en-GB')}</div>
                  </td>
                  <td className="p-4 text-sm text-neutral-600">
                    <span className="font-semibold">{coupon.timesUsed}</span> used
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(coupon)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleOpenModal(coupon)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-neutral-800 p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Coupon Code *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g. SUMMER20"
                    className="p-3 border border-neutral-300 rounded-xl uppercase"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Discount Type *</label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as any})}
                    className="p-3 border border-neutral-300 rounded-xl bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    placeholder={formData.discountType === 'percentage' ? "e.g. 20" : "e.g. 500"}
                    className="p-3 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Min Booking Amount (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.minBookingAmount}
                    onChange={(e) => setFormData({...formData, minBookingAmount: e.target.value})}
                    placeholder="0 for no minimum"
                    className="p-3 border border-neutral-300 rounded-xl"
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-neutral-700">Max Discount Amount (₹)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      placeholder="Leave empty for unlimited"
                      className="p-3 border border-neutral-300 rounded-xl"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Valid From *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    className="p-3 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Valid Until *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    className="p-3 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Total Usage Limit</label>
                  <input 
                    type="number" 
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    placeholder="Leave empty for unlimited"
                    className="p-3 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700">Usage Limit Per User</label>
                  <input 
                    type="number" 
                    value={formData.usageLimitPerUser}
                    onChange={(e) => setFormData({...formData, usageLimitPerUser: e.target.value})}
                    placeholder="Leave empty for unlimited"
                    className="p-3 border border-neutral-300 rounded-xl"
                  />
                </div>
                
                <div className="flex flex-col gap-2 justify-center mt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 accent-[#F97316]"
                    />
                    <span className="font-semibold text-neutral-700">Coupon is Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-[#F97316] hover:bg-orange-600 transition"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
