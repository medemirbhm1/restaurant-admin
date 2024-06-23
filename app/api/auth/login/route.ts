import { loginFormSchema } from "@/app/login/page";
import { createToken } from "@/lib/auth/token";
import { comparePassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.username || !body?.password) {
      throw new Error("Invalid username or password");
    }
    const { username, password } = body;
    const u = await db.query.user.findFirst({
      where: eq(user.username, username),
    });
    if (!u) {
      throw new Error("User not found");
    }
    const passwordMatch = await comparePassword(password, u.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    const token = createToken({
      username: u.username,
      id: u.id,
      type: u.type,
    });
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 72, // 3 days
      path: "/",
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
