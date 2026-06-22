import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/actions/getReservations";
import getReviews from "@/actions/getReviews";

interface IParams {
  listingId?: string;
}

export default async function ListingPage({ params }: { params: Promise<IParams> }) {
  const p = await params;
  const listing = await getListingById(p);
  const reservations = await getReservations(p);
  const reviews = await getReviews(p);
  const currentUser = await getCurrentUser();

  if (!listing) {
    return (
      <EmptyState />
    );
  }

  return (
    <ListingClient
      listing={listing}
      reservations={reservations}
      reviews={reviews}
      currentUser={currentUser}
    />
  );
}
