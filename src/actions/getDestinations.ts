import { connectToDatabase } from "@/lib/mongodb";
import Destination from "@/models/Destination";

export default async function getDestinations() {
  try {
    await connectToDatabase();
    
    // Only return active destinations, sorted by order
    const destinations = await Destination.find({ isActive: true }).sort({ order: 1 }).lean();
    
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
