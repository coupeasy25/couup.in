import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminCancellations from "@/actions/admin/getAdminCancellations";

export default async function AdminCancellationsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const cancellations = await getAdminCancellations();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cancellations Management</h1>
        <div className="text-neutral-500">{cancellations.length} total cancellations</div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">ID</th>
              <th className="p-4 font-semibold text-neutral-600">Listing</th>
              <th className="p-4 font-semibold text-neutral-600">Guest</th>
              <th className="p-4 font-semibold text-neutral-600">Cancelled Date</th>
              <th className="p-4 font-semibold text-neutral-600">Original Total</th>
              <th className="p-4 font-semibold text-neutral-600">Penalty / Fee</th>
              <th className="p-4 font-semibold text-neutral-600">Refund Amount</th>
            </tr>
          </thead>
          <tbody>
            {cancellations.map((reservation) => (
              <tr key={reservation._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4 text-sm text-neutral-500 font-mono">{reservation._id.substring(0, 8)}...</td>
                <td className="p-4 font-medium">{reservation.listing?.title || "Unknown"}</td>
                <td className="p-4">{reservation.user?.name || "Unknown"}</td>
                <td className="p-4 text-neutral-500">
                  {new Date(reservation.cancelledAt).toLocaleDateString()}
                </td>
                <td className="p-4 font-semibold text-neutral-600">₹{reservation.totalPrice}</td>
                <td className="p-4 font-semibold text-rose-500">₹{reservation.cancellationFee || 0}</td>
                <td className="p-4 font-semibold text-emerald-500">₹{reservation.refundAmount || 0}</td>
              </tr>
            ))}
            {cancellations.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">
                  No cancellations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
