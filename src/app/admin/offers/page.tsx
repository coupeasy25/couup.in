import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import EmptyState from "@/components/EmptyState";
import OffersClient from "./OffersClient";
import { getOffers } from "@/actions/admin/offerActions";

const OffersAdminPage = async () => {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return <EmptyState title="Unauthorized" subtitle="Please login as an admin" />;
  }

  const offers = await getOffers(true); // Include inactive

  return <OffersClient offers={offers} />;
};

export default OffersAdminPage;
