import { NextRequest } from "next/server";
import { isAuthenticated } from "./app/_lib/helpers";

export async function middleware(request: NextRequest) {
  const isAuth = await isAuthenticated();
  if (
    !isAuth &&
    request.nextUrl.pathname !== "/" &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/sign-up"
  ) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (
    isAuth &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/sign-up")
  ) {
    return Response.redirect(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/sign-up",
    "/dashboard",
    "/view-polls",
    "/poll/:path*",
  ],
};
