import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

// Super user's email (replace with your super user's email)
const SUPER_USER_EMAIL = "superuser@example.com";

/**
 * Check if the current user is a super user.
 * @returns {boolean} True if the user is a super user, false otherwise.
 */
export const isSuperUser = async () => {
  const auth = getAuth(getApp());
  const user = auth.currentUser;

  // Check if the user is logged in and their email matches the super user's email
  return user && user.email === SUPER_USER_EMAIL;
};

/**
 * Middleware to protect routes for super users only.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} Redirects non-super users to the home page.
 */
export const protectAdminRoutes = async (request: Request) => {
  const isSuper = await isSuperUser();

  if (!isSuper) {
    // Redirect non-super users to the home page or a 403 page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow super users to access the route
  return NextResponse.next();
};