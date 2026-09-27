import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 1. Determine hostname and subdomain
  const hostname = request.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const subdomain = hostname.endsWith(rootDomain)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

  // 2. Correlation ID
  const correlationId = request.headers.get("x-correlation-id") || crypto.randomUUID();

  // 3. Request Headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-correlation-id", correlationId);

  if (subdomain && subdomain !== hostname && subdomain !== "www") {
    requestHeaders.set("x-tenant-id", subdomain);
  }

  // 4. Decode NextAuth v5 session cookies (supporting both production Vercel HTTPS and localhost HTTP cookie names)
  const cookieName =
    request.cookies.get("__Secure-authjs.session-token")?.name ||
    request.cookies.get("authjs.session-token")?.name ||
    request.cookies.get("__Secure-next-auth.session-token")?.name ||
    request.cookies.get("next-auth.session-token")?.name;

  const rawCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  let token = null;
  if (cookieName) {
    try {
      token = await getToken({
        req: request,
        secret,
        cookieName,
        salt: cookieName,
      });
    } catch {
      token = null;
    }
  }

  if (!token && secret) {
    try {
      token = await getToken({ req: request, secret });
    } catch {
      token = null;
    }
  }

  const isLoggedIn = !!token || !!rawCookie;
  const roles = (token?.roles as string[]) || [];
  const isTenant = roles.includes("TENANT");
  const isLandlord = roles.includes("LANDLORD");
  const isAdmin = roles.includes("PLATFORM_ADMIN") || roles.includes("SUPER_ADMIN");

  // Define route protection rules
  const isTenantPath = pathname.startsWith("/portal");
  const isAdminPath = pathname.startsWith("/admin");
  const isLandlordPath = pathname.startsWith("/landlord");
  const isManagerPath =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname.startsWith("/properties") ||
    pathname.startsWith("/tenants") ||
    pathname.startsWith("/leases") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/collections") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings");

  // If user is ALREADY logged in and visits /login, redirect to portal/dashboard
  if (pathname === "/login" && isLoggedIn) {
    const callbackUrl = url.searchParams.get("callbackUrl");
    const target = callbackUrl || (isTenant ? "/portal/dashboard" : isLandlord ? "/landlord/dashboard" : isAdmin ? "/admin/dashboard" : "/dashboard");
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Enforce Tenant Route Boundary
  if (isTenantPath) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Authenticated users pass through to /portal where src/app/(tenant)/layout.tsx enforces DB-level tenant verification
  }

  // Enforce Admin Route Boundary
  if (isAdminPath) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin && token) {
      const dest = isTenant ? "/portal/dashboard" : isLandlord ? "/landlord/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // Enforce Landlord Route Boundary
  if (isLandlordPath) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isLandlord && !isAdmin && token) {
      const dest = isTenant ? "/portal/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // Prevent tenant users from accessing manager/organisation pages
  if (isManagerPath && isTenant && !isAdmin && token) {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-correlation-id", correlationId);
  if (subdomain) {
    response.headers.set("x-tenant-subdomain", subdomain);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|favicon.ico).*)",
  ],
};
