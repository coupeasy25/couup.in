import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import getFilterSettings from "@/actions/getFilterSettings";
import EmptyState from "@/components/EmptyState";
import BecomeHostClient from "@/app/become-a-host/BecomeHostClient";

interface IParams {
  listingId?: string;
}

export default async function EditPropertyPage({ params }: { params: Promise<IParams> }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login to access this page" />;
  }

  const p = await params;
  const listing = await getListingById(p);

  if (!listing) {
    return <EmptyState title="Not Found" subtitle="This property does not exist" />;
  }

  if (listing.userId !== currentUser.id) {
    return <EmptyState title="Unauthorized" subtitle="You are not authorized to edit this property" />;
  }

  const filterSettings = await getFilterSettings();

  return (
    <div className="pt-24 min-h-screen bg-white">
      <BecomeHostClient 
        currentUser={currentUser} 
        initialData={listing} 
        filterSettings={filterSettings}
      />
    </div>
  );
}
