import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminAuthenticated();

  // If not authenticated, we only render children if it's the login page
  // But wait, layout wraps everything in /admin. 
  // If we are on /admin/login, we shouldn't redirect to /admin/login!
  // To avoid infinite redirect, we handle the redirect in the pages themselves or in the layout by checking headers.
  // Actually, a simpler way is to check the pathname, but we can't easily do that in server component without headers().
  // So we'll just let pages handle their own auth checks for simplicity, OR we can check it in layout by passing down.

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8 gap-8">
      {isAdmin && (
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="flex flex-col gap-4 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <Link href="/admin" className="text-neutral-600 hover:text-black transition">Dashboard</Link>
            <Link href="/admin/users" className="text-neutral-600 hover:text-black transition">Users</Link>
            <Link href="/admin/listings" className="text-neutral-600 hover:text-black transition">Listings</Link>
            <Link href="/admin/reservations" className="text-neutral-600 hover:text-black transition">Reservations</Link>
            <Link href="/admin/settings" className="text-neutral-600 hover:text-black transition">Settings</Link>
            <hr className="my-2 border-neutral-200" />
            <AdminLogoutButton />
          </div>
        </aside>
      )}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
