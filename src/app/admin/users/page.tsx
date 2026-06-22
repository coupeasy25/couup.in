import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import getAdminUsers from "@/actions/admin/getAdminUsers";

export default async function AdminUsersPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const users = await getAdminUsers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="text-neutral-500">{users.length} total users</div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="p-4 font-semibold text-neutral-600">ID</th>
              <th className="p-4 font-semibold text-neutral-600">Name</th>
              <th className="p-4 font-semibold text-neutral-600">Email</th>
              <th className="p-4 font-semibold text-neutral-600">Role</th>
              <th className="p-4 font-semibold text-neutral-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                <td className="p-4 text-sm text-neutral-500 font-mono">{user._id.substring(0, 8)}...</td>
                <td className="p-4">{user.name || "N/A"}</td>
                <td className="p-4">{user.email || "N/A"}</td>
                <td className="p-4">
                  {user.isHost ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">Host</span>
                  ) : (
                    <span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded-full font-semibold">User</span>
                  )}
                </td>
                <td className="p-4 text-neutral-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
