import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { getAdminDestinations } from "@/actions/admin/adminDestinations";
import DestinationsClient from "./DestinationsClient";

export default async function AdminDestinationsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const destinations = await getAdminDestinations();

  return <DestinationsClient initialDestinations={destinations} />;
}
