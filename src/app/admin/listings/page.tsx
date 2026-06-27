import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminListings from "@/actions/admin/getAdminListings";
import AdminListingsClient from "./AdminListingsClient";

export default async function AdminListingsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const listings = await getAdminListings();

  return (
    <AdminListingsClient initialListings={listings} />
  );
}
