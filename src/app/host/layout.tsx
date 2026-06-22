import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import HostNav from "./HostNav";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.isHost) {
    redirect("/");
  }

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-24">
      <HostNav />
      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}
