import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import getFilterSettings from "@/actions/getFilterSettings";
import BecomeHostClient from "./BecomeHostClient";

const BecomeHostPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to become a host."
      />
    );
  }

  const filterSettings = await getFilterSettings();

  return <BecomeHostClient currentUser={currentUser} filterSettings={filterSettings} />;
};

export default BecomeHostPage;
