"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AdminLogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/admin/logout");
      toast.success("Logged out from admin panel");
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700 transition"
    >
      Logout Admin
    </button>
  );
};

export default AdminLogoutButton;
