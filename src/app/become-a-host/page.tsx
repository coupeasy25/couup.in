import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
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

  return <BecomeHostClient currentUser={currentUser} />;
};

export default BecomeHostPage;
