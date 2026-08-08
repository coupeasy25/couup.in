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
    <div className="flex min-h-screen max-w-[2520px] mx-auto bg-neutral-50/30">
      {/* Sidebar Navigation */}
      <div className="hidden md:block w-64 border-r border-neutral-200 bg-white min-h-screen sticky top-0 h-screen overflow-y-auto z-50">
        <HostNav />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile Header / Nav could go here later if needed */}
        <div className="p-4 md:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
