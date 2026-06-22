import EmptyState from "@/components/EmptyState";
import getUserById from "@/actions/getUserById";
import UserClient from "./UserClient";
import getCurrentUser from "@/actions/getCurrentUser";

interface IParams {
  userId?: string;
}

export default async function UserPage(props: { params: Promise<IParams> }) {
  const params = await props.params;
  const userData = await getUserById(params);
  const currentUser = await getCurrentUser();

  if (!userData || !userData.user) {
    return (
      <EmptyState
        title="User Not Found"
        subtitle="This profile does not exist or has been removed."
      />
    );
  }

  return (
    <UserClient
      userProfile={userData.user}
      listings={userData.listings}
      currentUser={currentUser}
    />
  );
}
