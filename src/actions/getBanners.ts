import { connectToDatabase } from "@/lib/mongodb";
import Banner from "@/models/Banner";

export async function getBanners() {
  try {
    await connectToDatabase();
    
    // Only return active banners, sorted by order
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 }).lean();
    
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
