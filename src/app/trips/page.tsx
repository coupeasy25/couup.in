import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import getReservations from "@/actions/getReservations";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login"
      />
    );
  }

  const reservations = await getReservations({ userId: currentUser.id });
  const { getUserInvoices } = await import("@/actions/invoiceActions");
  const invoices = await getUserInvoices();

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="Looks like you haven't reserved any trips."
      />
    );
  }

  return (
    <TripsClient
      reservations={reservations}
      currentUser={currentUser}
      invoices={invoices}
    />
  );
};

export default TripsPage;
