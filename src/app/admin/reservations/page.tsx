import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminReservations from "@/actions/admin/getAdminReservations";
import ReservationsClient from "./ReservationsClient";

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const reservations = await getAdminReservations();
  
  // Serialize reservations to pass to client component
  const serializedReservations = JSON.parse(JSON.stringify(reservations));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reservations Management</h1>
        <div className="text-neutral-500">{reservations.length} total reservations</div>
      </div>

      <ReservationsClient reservations={serializedReservations} />
    </div>
  );
}
