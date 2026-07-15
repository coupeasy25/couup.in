"use server";

import { connectToDatabase } from "@/lib/mongodb";
import AdBanner from "@/models/AdBanner";
import { isAdminAuthenticated } from "./adminAuth";
import { revalidatePath } from "next/cache";

export async function createAdminAdBanner(data: { imageSrc: string; link?: string }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();
    
    // We only need one active banner conceptually, but we can allow multiple
    const newAdBanner = await AdBanner.create({
      imageSrc: data.imageSrc,
      link: data.link || "",
      isActive: true,
    });

    return { success: true, data: JSON.parse(JSON.stringify(newAdBanner)) };
  } catch (error: any) {
    console.error("Error creating ad banner:", error);
    return { success: false, error: "Failed to create ad banner" };
  }
}

export async function getAdminAdBanners() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();
    
    const adBanners = await AdBanner.find().sort({ createdAt: -1 }).lean();
    
    return {
      success: true,
      data: adBanners.map((b: any) => ({
        ...b,
        _id: b._id.toString(),
        createdAt: b.createdAt?.toISOString(),
        updatedAt: b.updatedAt?.toISOString(),
      })),
    };
  } catch (error: any) {
    console.error("Error fetching admin ad banners:", error);
    return { success: false, error: "Failed to fetch ad banners" };
  }
}

export async function deleteAdminAdBanner(bannerId: string) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();
    await AdBanner.findByIdAndDelete(bannerId);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting ad banner:", error);
    return { success: false, error: "Failed to delete ad banner" };
  }
}

export async function toggleAdminAdBannerStatus(bannerId: string, isActive: boolean) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();
    await AdBanner.findByIdAndUpdate(bannerId, { isActive });

    return { success: true };
  } catch (error: any) {
    console.error("Error toggling ad banner status:", error);
    return { success: false, error: "Failed to update ad banner status" };
  }
}
