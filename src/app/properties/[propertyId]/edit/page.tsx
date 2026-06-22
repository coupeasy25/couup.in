import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import BecomeHostClient from "@/app/become-a-host/BecomeHostClient";

interface IParams {
  propertyId?: string;
}

const EditPropertyPage = async ({ params }: { params: Promise<IParams> }) => {
  const p = await params;
  const { propertyId } = p;
  const listing = await getListingById({ listingId: propertyId });
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to edit this property."
      />
    );
  }

  if (!listing) {
    return (
      <EmptyState
        title="Listing not found"
        subtitle="This property does not exist or has been removed."
      />
    );
  }

  if (listing.user.id !== currentUser.id && listing.userId !== currentUser.id) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You do not have permission to edit this property."
      />
    );
  }

  // Pass listing data down to BecomeHostClient
  return (
    <BecomeHostClient currentUser={currentUser} initialData={listing} />
  );
};

export default EditPropertyPage;
