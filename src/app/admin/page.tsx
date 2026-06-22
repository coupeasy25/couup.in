import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminStats from "@/actions/admin/getAdminStats";

export default async function AdminDashboardPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-neutral-500 mt-2">Welcome to the owner admin panel. Here is an overview of your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-2">
          <div className="text-neutral-500 font-semibold">Total Users</div>
          <div className="text-4xl font-bold">{stats.userCount}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-2">
          <div className="text-neutral-500 font-semibold">Total Listings</div>
          <div className="text-4xl font-bold">{stats.listingCount}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-2">
          <div className="text-neutral-500 font-semibold">Total Reservations</div>
          <div className="text-4xl font-bold">{stats.reservationCount}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col gap-2">
          <div className="text-neutral-500 font-semibold">Total Hosts</div>
          <div className="text-4xl font-bold">{stats.hostCount}</div>
        </div>
      </div>
    </div>
  );
}
