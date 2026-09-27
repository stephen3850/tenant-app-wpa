import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 1. Hostname & Subdomain
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

  // 4. Check session cookie existence (supporting production Vercel HTTPS & local HTTP)
  const allCookies = request.cookies.getAll();
  const sessionCookie = allCookies.find((c) =>
    c.name.includes("session-token") || c.name.includes("authjs") || c.name.includes("next-auth")
  );
  const rawCookie = sessionCookie?.value;

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  let token = null;
  if (secret) {
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

  // Route protection
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

  // 1. Unauthenticated users accessing protected routes -> redirect to /login
  const isProtectedPath = isTenantPath || isAdminPath || isLandlordPath || isManagerPath;
  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Logged-in users visiting /login -> redirect to callbackUrl or primary dashboard
  if (pathname === "/login" && isLoggedIn) {
    const callbackUrl = url.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl !== "/login" && !callbackUrl.includes("/login")) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    const target = isTenant ? "/portal/dashboard" : isLandlord ? "/landlord/dashboard" : isAdmin ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
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
