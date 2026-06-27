import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { getAdminNotifications } from "@/actions/admin/adminNotifications";
import NotificationsClient from "./NotificationsClient";

export default async function AdminNotificationsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const notifications = await getAdminNotifications();

  return <NotificationsClient initialNotifications={notifications} />;
}
