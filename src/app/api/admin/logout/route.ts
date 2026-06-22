import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ADMIN_LOGOUT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
