import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_COOKIE_VALUE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const unlocked =
    request.cookies.get(ACCESS_COOKIE)?.value === ACCESS_COOKIE_VALUE;

  // Already open — skip the gate
  if (pathname === "/unlock" || pathname.startsWith("/unlock/")) {
    if (unlocked) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!unlocked) {
    const unlockUrl = new URL("/unlock", request.url);
    return NextResponse.redirect(unlockUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Gate app routes. Skip Next internals and common static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
