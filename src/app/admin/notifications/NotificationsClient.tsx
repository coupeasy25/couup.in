"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminNotification, deleteAdminNotification, toggleAdminNotificationStatus } from "@/actions/admin/adminNotifications";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Bell, Send } from "lucide-react";

interface NotificationData {
  _id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export default function NotificationsClient({ initialNotifications }: { initialNotifications: NotificationData[] }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationData[]>(initialNotifications);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Title and Message are required");
      return;
    }

    setIsLoading(true);
    const res = await createAdminNotification({ title, message });
    if (res.success) {
      toast.success("Notification Broadcasted!");
      setTitle("");
      setMessage("");
      setIsAdding(false);
      router.refresh();
      setNotifications([{ 
        _id: res.id as string, 
        title, 
        message, 
        isActive: true, 
        createdAt: new Date().toISOString() 
      }, ...notifications]);
    } else {
      toast.error(res.error || "Failed to broadcast notification");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    
    setIsLoading(true);
    const res = await deleteAdminNotification(id);
    if (res.success) {
      toast.success("Notification deleted");
      setNotifications(notifications.filter((n) => n._id !== id));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setIsLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    const res = await toggleAdminNotificationStatus(id, !currentStatus);
    if (res.success) {
      toast.success(`Notification ${!currentStatus ? 'activated' : 'deactivated'}`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isActive: !currentStatus } : n));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Broadcast Notifications</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-xl hover:bg-[#F97316]/90 transition"
        >
          <Plus size={20} />
          {isAdding ? "Cancel" : "New Broadcast"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 border border-neutral-200 rounded-xl shadow-sm mb-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send size={20} className="text-[#F97316]" />
            Compose Broadcast
          </h2>
          <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Notification Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flash Sale Alert!"
                className="w-full p-3 border border-neutral-300 rounded-xl outline-none focus:border-[#F97316] transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message Body *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full p-3 border border-neutral-300 rounded-xl outline-none focus:border-[#F97316] transition resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F97316] text-white font-semibold py-3 rounded-xl hover:bg-[#F97316]/90 transition disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
            >
              <Send size={18} />
              {isLoading ? "Broadcasting..." : "Send to All Users"}
            </button>
          </form>
        </div>
      )}

      {notifications.length === 0 && !isAdding ? (
        <div className="bg-white p-12 text-center rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
            <Bell size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Notifications Sent</h3>
          <p className="text-neutral-500 mb-6">You haven't broadcasted any notifications yet.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl hover:bg-[#F97316]/90 transition font-medium"
          >
            <Plus size={20} />
            Compose Broadcast
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((notif) => (
            <div key={notif._id} className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm flex flex-col">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">
                    <Bell size={14} className={notif.isActive ? "text-[#F97316]" : "text-neutral-400"} />
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleToggleStatus(notif._id, notif.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm transition ${
                      notif.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-neutral-400 hover:bg-neutral-500'
                    }`}
                  >
                    {notif.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">{notif.title}</h3>
                <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">{notif.message}</p>
              </div>
              
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center mt-auto">
                <div className="text-sm font-medium text-neutral-500">
                  Status: <span className={notif.isActive ? "text-green-600 font-bold" : "text-neutral-500"}>
                    {notif.isActive ? "Live in App" : "Hidden"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(notif._id)}
                  disabled={isLoading}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  title="Delete Notification"
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
