import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { getSettings } from "@/actions/admin/settingsActions";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-neutral-500 mt-2">Manage global configurations for the platform.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <SettingsClient initialFeaturedCities={settings?.featuredCities || []} />
      </div>
    </div>
  );
}
