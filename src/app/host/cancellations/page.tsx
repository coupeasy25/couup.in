import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import getReservations from "@/actions/getReservations";
import HostCancellationsClient from "./HostCancellationsClient";

export default async function HostCancellationsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const cancellations = await getReservations({ authorId: currentUser.id, status: 'Cancelled' });

  if (cancellations.length === 0) {
    return (
      <EmptyState
        title="No cancellations found"
        subtitle="Looks like you have no cancelled bookings on your properties."
      />
    );
  }

  return (
    <HostCancellationsClient
      cancellations={cancellations}
    />
  );
}
