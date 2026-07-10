"use server";

import { connectToDatabase } from "@/lib/mongodb";
import Amenity from "@/models/Amenity";

export async function getAmenities() {
  try {
    await connectToDatabase();
    
    // Sort by name for consistency
    const amenities = await Amenity.find().sort({ name: 1 }).lean();
    
    return amenities.map((a: any) => ({
      _id: a._id.toString(),
      name: a.name,
      isQuickFilter: a.isQuickFilter,
      isActive: a.isActive,
      createdAt: a.createdAt?.toISOString(),
      updatedAt: a.updatedAt?.toISOString(),
    }));
  } catch (error: any) {
    console.error("Error fetching amenities:", error);
    return [];
  }
}

export async function getActiveAmenities() {
  try {
    await connectToDatabase();
    
    // Sort by name for consistency
    const amenities = await Amenity.find({ isActive: true }).sort({ name: 1 }).lean();
    
    return amenities.map((a: any) => ({
      _id: a._id.toString(),
      name: a.name,
      isQuickFilter: a.isQuickFilter,
      isActive: a.isActive,
    }));
  } catch (error: any) {
    console.error("Error fetching active amenities:", error);
    return [];
  }
}
