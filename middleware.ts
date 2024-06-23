// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import { JwtPayload } from "jsonwebtoken";
import { isAdmin, isAuthenticated } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!(await isAdmin(token?.value))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect /dashboard and its sub-routes
};
