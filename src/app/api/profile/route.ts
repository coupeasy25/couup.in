import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, email, age, mobileNumber } = body;

    if (!name || !email) {
      return new NextResponse("Name and Email are required", { status: 400 });
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, email, age, mobileNumber },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
