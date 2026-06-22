import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import BookClient from "./BookClient";

interface IParams {
  listingId?: string;
}

const BookPage = async ({ params }: { params: Promise<IParams> }) => {
  const p = await params;
  const listing = await getListingById({ listingId: p.listingId });
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to complete your booking."
      />
    );
  }

  if (!listing) {
    return (
      <EmptyState
        title="Listing not found"
        subtitle="The listing you are trying to book does not exist."
      />
    );
  }

  return (
    <BookClient
      listing={listing}
      currentUser={currentUser}
    />
  );
};

export default BookPage;
