import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Return 404 for /docs/mata_kuliah and all its subpaths
  if (
    pathname === "/docs/mata_kuliah" ||
    pathname.startsWith("/docs/mata_kuliah/")
  ) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/docs/mata_kuliah/:path*"],
};
