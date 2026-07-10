import getCurrentUser from "@/actions/getCurrentUser";
import getListings from "@/actions/getListings";
import getReservations from "@/actions/getReservations";
import EmptyState from "@/components/EmptyState";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const listings = await getListings({ userId: currentUser.id });
  const reservations = await getReservations({ authorId: currentUser.id });

  return (
    <DashboardClient
      listings={listings}
      allReservations={reservations}
      currentUser={currentUser}
    />
  );
}
