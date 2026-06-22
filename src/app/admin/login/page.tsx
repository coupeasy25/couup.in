"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("/api/admin/login", { password });
      toast.success("Welcome to Admin Panel");
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Incorrect password");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full min-h-[50vh]">
      <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm w-full max-w-md flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-neutral-500 mt-2">Enter the owner password to access the admin panel.</p>
        </div>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            className="w-full p-4 border border-neutral-300 rounded-md focus:outline-none focus:border-black transition"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-md transition disabled:opacity-70"
          >
            {isLoading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
