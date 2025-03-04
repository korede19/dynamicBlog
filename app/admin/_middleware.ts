import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/firebase";

export async function middleware(request: NextRequest) {
  const user = auth.currentUser;

  if (!user) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Allow authenticated users to access the route
  return NextResponse.next();
}

// Apply middleware to all routes in the admin folder
export const config = {
  matcher: "/admin/:path*",
};