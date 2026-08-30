import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/orders/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/products/:path*",

    "/login/:path*",
    "/signup/:path*",
    "/register/:path*",
  ],
};