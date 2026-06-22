import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminListings from "@/actions/admin/getAdminListings";

export default async function AdminListingsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const listings = await getAdminListings();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Listings Management</h1>
        <div className="text-neutral-500">{listings.length} total listings</div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">ID</th>
              <th className="p-4 font-semibold text-neutral-600">Title</th>
              <th className="p-4 font-semibold text-neutral-600">Host</th>
              <th className="p-4 font-semibold text-neutral-600">Location</th>
              <th className="p-4 font-semibold text-neutral-600">Price</th>
              <th className="p-4 font-semibold text-neutral-600">Created</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4 text-sm text-neutral-500 font-mono">{listing._id.substring(0, 8)}...</td>
                <td className="p-4 font-medium">{listing.title}</td>
                <td className="p-4">{listing.user?.name || "Unknown"}</td>
                <td className="p-4">{listing.locationValue || listing.fullAddress}</td>
                <td className="p-4 font-semibold">₹{listing.price}</td>
                <td className="p-4 text-neutral-500">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No listings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
