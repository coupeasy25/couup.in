import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export default async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    await connectToDatabase();

    const currentUser = await User.findOne({ email: session.user.email }).lean();

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      id: currentUser._id.toString(),
      _id: currentUser._id.toString(),
      createdAt: currentUser.createdAt?.toISOString ? currentUser.createdAt.toISOString() : null,
      updatedAt: currentUser.updatedAt?.toISOString ? currentUser.updatedAt.toISOString() : null,
    };
  } catch (error: any) {
    return null;
  }
}
