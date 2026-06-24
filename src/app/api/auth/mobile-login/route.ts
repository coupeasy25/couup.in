import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user || !user?.hashedPassword) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(
      password as string,
      user.hashedPassword
    );

    if (!isCorrectPassword) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // Return the user data (without password)
    return NextResponse.json(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        isHost: user.isHost || false,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
