import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const hasLogin = request.cookies.has("signed-id");
  const currentUser = request.cookies.get("current-user")?.value;
  const userRole = currentUser ? JSON.parse(currentUser)?.role : null;

  const guestAccess = ["/register", "/login", "/"];

  if (guestAccess.includes(pathname) && !hasLogin) {
    return NextResponse.next();
  } else if (hasLogin) {
    if (["/register", "/login"].includes(pathname)) {
      const routeTarget = userRole === "super-admin" ? "app-control" : "questionnaire";
      return NextResponse.redirect(`${origin}/${routeTarget}`);
    } else if (pathname === "/app-control" && userRole !== "super-admin") {
      return NextResponse.redirect(`${origin}/unauthorized`);
    }
  } else {
    return NextResponse.redirect(`${origin}/login`);
  }

  // If the current path doesn't match any redirection rule, continue to the next route
  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|favicon.ico|login|register|).*)",
    "/questionnaire/:path*",
    "/app-control/:path*",
    "/unauthorized/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
};
