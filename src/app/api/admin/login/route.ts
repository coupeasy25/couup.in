import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return new NextResponse("Admin panel is not configured correctly on the server.", { status: 500 });
    }

    if (password !== adminPassword) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ADMIN_LOGIN_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
