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
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  // User is logged in:
  // Don't allow login/signup/register pages
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/account", request.url)
    );
  }

  // User is not logged in:
  // Redirect protected pages to login
  if (!sessionToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);

    // Preserve the complete requested URL
    loginUrl.searchParams.set(
      "redirectTo",
      request.nextUrl.pathname + request.nextUrl.search
    );

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