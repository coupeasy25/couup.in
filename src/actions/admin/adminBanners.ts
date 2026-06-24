"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { isAdminAuthenticated } from "./adminAuth";
import { revalidatePath } from "next/cache";

export async function getAdminBanners() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 }).lean();
    
    // Convert ObjectIds to strings to avoid serialization issues
    return banners.map((banner: any) => ({
      ...banner,
      _id: banner._id.toString(),
      createdAt: banner.createdAt?.toISOString(),
      updatedAt: banner.updatedAt?.toISOString(),
    }));
  } catch (error: any) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

export async function createAdminBanner(data: { imageSrc: string; title?: string; isActive?: boolean; order?: number }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const newBanner = await Banner.create(data);
    
    revalidatePath("/admin/banners");
    return { success: true, id: newBanner._id.toString() };
  } catch (error: any) {
    console.error("Error creating banner:", error);
    return { success: false, error: "Failed to create banner" };
  }
}

export async function deleteAdminBanner(bannerId: string) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Banner.findByIdAndDelete(bannerId);
    
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting banner:", error);
    return { success: false, error: "Failed to delete banner" };
  }
}

export async function toggleAdminBannerStatus(bannerId: string, isActive: boolean) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Banner.findByIdAndUpdate(bannerId, { isActive });
    
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating banner:", error);
    return { success: false, error: "Failed to update banner status" };
  }
}
