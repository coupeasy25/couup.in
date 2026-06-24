import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { getAdminBanners } from "@/actions/admin/adminBanners";
import BannersClient from "./BannersClient";

export default async function AdminBannersPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const banners = await getAdminBanners();

  return <BannersClient initialBanners={banners} />;
}
