import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const isAuthed = session !== null;

  // Signed-in users should never see the login screen.
  if (pathname === "/login") {
    if (isAuthed) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Root → dashboard (authed) or login.
  if (pathname === "/") {
    return NextResponse.redirect(new URL(isAuthed ? "/admin/dashboard" : "/login", request.url));
  }

  // Everything under /admin requires a valid session.
  if (pathname.startsWith("/admin")) {
    if (!isAuthed) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on app routes, but skip Next internals, the auth API, and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|wellpass-).*)"],
};
