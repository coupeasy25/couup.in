"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Offer from "@/models/Offer";
import { isAdminAuthenticated } from "@/actions/admin/adminAuth";
import { revalidatePath } from "next/cache";

export async function getOffers(includeInactive = false) {
  try {
    await connectToDatabase();
    
    const query = includeInactive ? {} : { isActive: true };
    const offers = await Offer.find(query).sort({ order: 1, createdAt: -1 });

    return JSON.parse(JSON.stringify(offers));
  } catch (error: any) {
    console.error("Error getting offers:", error);
    return [];
  }
}

export async function createOffer(data: any) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    
    // Provide a fallback title to prevent cached Mongoose schema validation errors
    if (!data.title) {
      data.title = "Untitled Offer";
    }

    const newOffer = new Offer(data);
    await newOffer.save();
    
    revalidatePath("/");
    revalidatePath("/admin/offers");
    
    return { success: true, offer: JSON.parse(JSON.stringify(newOffer)) };
  } catch (error: any) {
    console.error("Error creating offer:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOffer(id: string, data: any) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    
    revalidatePath("/");
    revalidatePath("/admin/offers");
    
    return { success: true, offer: JSON.parse(JSON.stringify(updatedOffer)) };
  } catch (error: any) {
    console.error("Error updating offer:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteOffer(id: string) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();
    await Offer.findByIdAndDelete(id);
    
    revalidatePath("/");
    revalidatePath("/admin/offers");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting offer:", error);
    return { success: false, error: error.message };
  }
}
