import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Next.js Middleware to protect routes.
 * This function is wrapped by the `auth` helper from NextAuth.js,
 * which provides the session object in the request.
 */
export default auth((req) => {
  // If `req.auth` is null, it means the user is not authenticated.
  if (!req.auth) {
    // Construct the absolute URL for the login page.
    const loginUrl = new URL("/login", req.url);
    // Redirect unauthenticated users to the login page.
    return Response.redirect(loginUrl);
  }
  // If authenticated, allow the request to proceed.
  return;
});

// Configuration for the middleware to specify which paths to protect.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api (API routes - will be protected individually)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - /login (the login page itself to avoid redirect loops)
     * - /signup (the signup page)
     * - Any .svg files (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|.*\.svg$).*)",
  ],
};
