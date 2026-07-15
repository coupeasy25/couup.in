import { connectToDatabase } from "@/lib/mongodb";
import AdBanner from "@/models/AdBanner";

export async function getAdBanners() {
  try {
    await connectToDatabase();
    
    // Fetch only active ad banners
    const adBanners = await AdBanner.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    
    return adBanners.map((banner: any) => ({
      ...banner,
      _id: banner._id.toString(),
      createdAt: banner.createdAt?.toISOString(),
      updatedAt: banner.updatedAt?.toISOString(),
    }));
  } catch (error: any) {
    console.error("Error fetching ad banners:", error);
    return [];
  }
}
