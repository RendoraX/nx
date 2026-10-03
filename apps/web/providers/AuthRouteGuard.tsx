'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from './AuthProviders';

const GUEST_ONLY_ROUTES = ['/login', '/register'];

const PROTECTED_PREFIXES = [
  '/profile',
  '/account',
  '/orders',
  '/wishlist',
  '/checkout',
  '/cart',
];

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated } = useAuthContext();

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);
  const shouldRedirect =
    !loading &&
    ((isProtectedRoute && !isAuthenticated) ||
      (isGuestOnlyRoute && isAuthenticated));

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }

    if (isProtectedRoute && !isAuthenticated) {
      const redirectTo = encodeURIComponent(
        `${pathname}${window.location.search}`
      );
      router.replace(`/login?redirectTo=${redirectTo}`);
      return;
    }

    router.replace('/products');
  }, [
    isAuthenticated,
    isProtectedRoute,
    pathname,
    router,
    shouldRedirect,
  ]);

  if ((loading && (isProtectedRoute || isGuestOnlyRoute)) || shouldRedirect) {
    return null;
  }

  return children;
}
