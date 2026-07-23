import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken && request.nextUrl.pathname.startsWith("/:path*")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}