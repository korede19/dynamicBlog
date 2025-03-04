import { auth } from "./firebase";

const SUPER_USER_EMAIL = "oyeyemikorede5@gmail.com";

// Check if the user is a super user
export const isSuperUser = () => {
  const user = auth.currentUser;
  return user && user.email === SUPER_USER_EMAIL;
};

// Log out the user
export const logout = async () => {
  await auth.signOut();
};