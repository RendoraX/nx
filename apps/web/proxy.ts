import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/products",
  "/categories",
  "/about",
  "/contact",
];

const AUTH_SETUP_ROUTES = [
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
];

const PROTECTED_PREFIXES = [
  "/profile",
  "/account",
  "/orders",
  "/wishlist",
  "/checkout",
  "/cart",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("accessToken")?.value;

  // --------------------------------------------------
  // 1. Allow public routes
  // --------------------------------------------------

  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/categories/")
  ) {
    return NextResponse.next();
  }

  // --------------------------------------------------
  // 2. Authenticated user visiting login/register
  // --------------------------------------------------

  if (GUEST_ONLY_ROUTES.includes(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(
        new URL("/products", request.url)
      );
    }

    return NextResponse.next();
  }

  // --------------------------------------------------
  // 3. Auth setup pages
  // These MUST remain accessible without login
  // --------------------------------------------------

  if (AUTH_SETUP_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // --------------------------------------------------
  // 4. Protected routes
  // --------------------------------------------------

  const isProtectedRoute =
    PROTECTED_PREFIXES.some((route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
    );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    // Optional: return user to the requested page
    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  // --------------------------------------------------
  // 5. Everything else
  // --------------------------------------------------

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on application routes.
     * Exclude Next.js internals and static files.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};