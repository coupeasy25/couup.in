import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { isAdminAuthenticated } from "./adminAuth";

export default async function getAdminUsers() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    await connectToDatabase();

    const users = await User.find().sort({ createdAt: -1 });

    const safeUsers = users.map((user) => ({
      ...user.toObject(),
      _id: user._id.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    }));

    return safeUsers;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
