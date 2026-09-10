import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Generate Correlation ID for tracing
  // Use crypto.randomUUID() which is available in Next.js Edge Runtime
  const correlationId = request.headers.get("x-correlation-id") || crypto.randomUUID();

  // 2. Create a new Headers object to pass to the request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-correlation-id", correlationId);

  // 3. Create the response with the modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 4. Add to response headers for debugging/client-side tracing
  response.headers.set("x-correlation-id", correlationId);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|favicon.ico).*)",
  ],
};
