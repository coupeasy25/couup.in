import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { LayoutDashboard, Users, Building, CalendarCheck, CreditCard, Settings, Image as ImageIcon, MapPin, Bell, XCircle, Filter, Tag, Coffee } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminAuthenticated();

  return (
    <div className="pt-32 pb-20 bg-neutral-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 gap-8">
        {isAdmin && (
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="flex flex-col bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden sticky top-32">
              <div className="p-6 bg-neutral-100 text-neutral-900 border-b border-neutral-200">
                <h2 className="text-xl font-bold tracking-wider">ADMIN PORTAL</h2>
                <p className="text-sm text-neutral-500 mt-1">Management Dashboard</p>
              </div>
              <div className="flex flex-col p-4 gap-2">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link href="/admin/coupons" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Tag size={20} />
                  Coupons
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Users size={20} />
                  Users
                </Link>
                <Link href="/admin/listings" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Building size={20} />
                  Listings
                </Link>
                <Link href="/admin/reservations" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <CalendarCheck size={20} />
                  Reservations
                </Link>
                <Link href="/admin/cancellations" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <XCircle size={20} />
                  Cancellations
                </Link>
                <Link href="/admin/invoices" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <CreditCard size={20} />
                  Invoices
                </Link>
                <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <CreditCard size={20} />
                  Payments
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Settings size={20} />
                  Settings
                </Link>
                <Link href="/admin/settings/filters" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Filter size={20} />
                  Filters
                </Link>
                <Link href="/admin/banners" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <ImageIcon size={20} />
                  Banners
                </Link>
                <Link href="/admin/ads" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <ImageIcon size={20} />
                  Ads
                </Link>
                <Link href="/admin/offers" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Coffee size={20} />
                  Offers
                </Link>
                <Link href="/admin/destinations" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <MapPin size={20} />
                  Destinations
                </Link>
                <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-[#F97316] hover:bg-neutral-100 rounded-xl transition font-medium">
                  <Bell size={20} />
                  Notifications
                </Link>
                <hr className="my-4 border-neutral-200" />
                <AdminLogoutButton />
              </div>
            </div>
          </aside>
        )}
        <main className="flex-grow w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
