"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { isAdminAuthenticated } from "./adminAuth";
import { revalidatePath } from "next/cache";

export async function getAdminNotifications() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
    
    return notifications.map((notif: any) => ({
      ...notif,
      _id: notif._id.toString(),
      createdAt: notif.createdAt?.toISOString(),
      updatedAt: notif.updatedAt?.toISOString(),
    }));
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function createAdminNotification(data: { title: string; message: string; isActive?: boolean }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const newNotif = await Notification.create(data);
    
    revalidatePath("/admin/notifications");
    return { success: true, id: newNotif._id.toString() };
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function deleteAdminNotification(id: string) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Notification.findByIdAndDelete(id);
    
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

export async function toggleAdminNotificationStatus(id: string, isActive: boolean) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Notification.findByIdAndUpdate(id, { isActive });
    
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating notification status:", error);
    return { success: false, error: "Failed to update notification status" };
  }
}
