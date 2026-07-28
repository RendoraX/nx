// apps/web/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/account",
  "/orders",
  "/cart",
  "/checkout",
  "/products",
];

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/register",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("accessToken")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. User is logged in: don't allow access to auth pages
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // 2. User is not logged in: redirect protected pages to login
  if (!sessionToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);

    // Prevent storing /login as the redirect target
    const currentPath = request.nextUrl.pathname + request.nextUrl.search;
    if (!currentPath.startsWith("/login")) {
      loginUrl.searchParams.set("redirectTo", currentPath);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/orders/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/products/:path*",

    "/login",
    "/login/:path*",

    "/signup",
    "/signup/:path*",

    "/register",
    "/register/:path*",
  ],
};