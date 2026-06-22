import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminStats from "@/actions/admin/getAdminStats";
import DashboardCards from "@/components/admin/DashboardCards";

export default async function AdminDashboardPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0f3d30]">Welcome back, Admin</h1>
          <p className="text-neutral-500 mt-2">Here is an overview of the platform's performance today.</p>
        </div>
      </div>

      <DashboardCards stats={stats} />
    </div>
  );
}
