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

  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("========== PROXY ==========");
  console.log("PATH:", pathname);
  console.log("HAS ACCESS TOKEN:", Boolean(accessToken));
  console.log(
    "COOKIES:",
    request.cookies.getAll().map((cookie) => cookie.name)
  );
  console.log("============================");

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/account", request.url)
    );
  }

  if (!accessToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);

    const currentPath =
      request.nextUrl.pathname + request.nextUrl.search;

    if (!currentPath.startsWith("/login")) {
      loginUrl.searchParams.set(
        "redirectTo",
        currentPath
      );
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}