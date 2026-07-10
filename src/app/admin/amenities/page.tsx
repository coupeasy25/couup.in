import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { getAmenities } from "@/actions/getAmenities";
import AmenitiesClient from "./AmenitiesClient";

export default async function AdminAmenitiesPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const amenities = await getAmenities();

  return <AmenitiesClient initialAmenities={amenities} />;
}
