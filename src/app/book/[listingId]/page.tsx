import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import BookClient from "./BookClient";
import { getSettings } from "@/actions/admin/settingsActions";

interface IParams {
  listingId?: string;
}

const BookPage = async ({ params }: { params: Promise<IParams> }) => {
  const p = await params;
  const listing = await getListingById({ listingId: p.listingId });
  const currentUser = await getCurrentUser();
  const settings = await getSettings();

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
      settings={settings}
    />
  );
};

export default BookPage;
