"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { isAdminAuthenticated } from "./adminAuth";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    await connectToDatabase();
    
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ featuredCities: [] });
    }

    return {
      id: setting._id.toString(),
      featuredCities: setting.featuredCities || [],
      createdAt: setting.createdAt?.toISOString(),
      updatedAt: setting.updatedAt?.toISOString(),
    };
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}

export async function updateFeaturedCities(cities: string[]) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await connectToDatabase();
    
    let setting = await Setting.findOne();
    if (!setting) {
      await Setting.create({ featuredCities: cities });
    } else {
      setting.featuredCities = cities;
      await setting.save();
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Something went wrong" };
  }
}
