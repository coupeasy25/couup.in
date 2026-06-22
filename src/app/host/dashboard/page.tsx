import getCurrentUser from "@/actions/getCurrentUser";
import getListings from "@/actions/getListings";
import getReservations from "@/actions/getReservations";
import EmptyState from "@/components/EmptyState";
import RecentReservationsClient from "./RecentReservationsClient";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const listings = await getListings({ userId: currentUser.id });
  const reservations = await getReservations({ authorId: currentUser.id });

  const totalRevenue = reservations.reduce((acc: number, reservation: any) => {
    return acc + reservation.totalPrice;
  }, 0);

  const totalBookings = reservations.length;
  const activeListings = listings.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold text-neutral-500">Total Revenue</div>
          <div className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString("en-IN")}</div>
        </div>
        <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold text-neutral-500">Total Bookings</div>
          <div className="text-3xl font-bold mt-2">{totalBookings}</div>
        </div>
        <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm">
          <div className="text-lg font-semibold text-neutral-500">Active Listings</div>
          <div className="text-3xl font-bold mt-2">{activeListings}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Reservations</h2>
        <RecentReservationsClient reservations={reservations} />
      </div>
    </div>
  );
}
