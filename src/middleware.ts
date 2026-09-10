import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware executing for:", request.nextUrl.pathname);
  const url = request.nextUrl;

  // 1. Determine hostname and subdomain
  const hostname = request.headers.get("host") || "";

  // Define root domain (should be in env for production)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // Extract subdomain
  const subdomain = hostname.endsWith(rootDomain)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

  // 2. Generate Correlation ID for tracing
  const correlationId = request.headers.get("x-correlation-id") || crypto.randomUUID();

  // 3. Setup Request Headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-correlation-id", correlationId);

  if (subdomain && subdomain !== hostname && subdomain !== "www") {
    requestHeaders.set("x-tenant-id", subdomain);
  }

  // 4. Multi-tenant Routing / Context Handling
  // Example: If it's a tenant subdomain, you might want to rewrite to a specific tenant path
  // but usually for Next.js 15, we just pass the header or use the hostname in server components.

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Add to response headers
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
