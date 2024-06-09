import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { CURRENT_PATH_HEADER } from "./constants/header";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(CURRENT_PATH_HEADER, request.nextUrl.pathname);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
