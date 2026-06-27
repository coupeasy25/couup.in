import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import getReservations from "@/actions/getReservations";
import DashboardClient from "./DashboardClient";

interface IParams {
  propertyId?: string;
}

const DashboardPage = async (
  props: { params: Promise<IParams> }
) => {
  const params = await props.params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  // Next.js uses propertyId here, but our actions expect listingId
  const actionParams = { listingId: params.propertyId };

  const listing = await getListingById(actionParams);

  if (!listing) {
    return <EmptyState title="Not found" subtitle="Listing not found" />;
  }

  if (listing.userId !== currentUser.id) {
    return <EmptyState title="Unauthorized" subtitle="You are not the host of this property" />;
  }

  const reservations = await getReservations(actionParams);

  return (
    <DashboardClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
    />
  );
};

export default DashboardPage;
