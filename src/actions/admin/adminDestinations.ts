"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Destination from "@/models/Destination";
import { isAdminAuthenticated } from "./adminAuth";
import { revalidatePath } from "next/cache";

export async function getAdminDestinations() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const destinations = await Destination.find().sort({ order: 1, createdAt: -1 }).lean();
    
    // Convert ObjectIds to strings to avoid serialization issues
    return destinations.map((destination: any) => ({
      ...destination,
      _id: destination._id.toString(),
      createdAt: destination.createdAt?.toISOString(),
      updatedAt: destination.updatedAt?.toISOString(),
    }));
  } catch (error: any) {
    console.error("Error fetching destinations:", error);
    return [];
  }
}

export async function createAdminDestination(data: { imageSrc: string; name: string; isActive?: boolean; order?: number }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const newDestination = await Destination.create(data);
    
    revalidatePath("/admin/destinations");
    return { success: true, id: newDestination._id.toString() };
  } catch (error: any) {
    console.error("Error creating destination:", error);
    return { success: false, error: "Failed to create destination" };
  }
}

export async function deleteAdminDestination(destinationId: string) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Destination.findByIdAndDelete(destinationId);
    
    revalidatePath("/admin/destinations");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting destination:", error);
    return { success: false, error: "Failed to delete destination" };
  }
}

export async function toggleAdminDestinationStatus(destinationId: string, isActive: boolean) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Destination.findByIdAndUpdate(destinationId, { isActive });
    
    revalidatePath("/admin/destinations");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating destination:", error);
    return { success: false, error: "Failed to update destination status" };
  }
}
