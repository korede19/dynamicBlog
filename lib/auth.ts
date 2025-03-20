import { auth } from "./firebase";

const SUPER_USER_EMAIL = "oyeyemikorede5@gmail.com";

export const isSuperUser = () => {
  const user = auth.currentUser;
  return user && user.email === SUPER_USER_EMAIL;
};

export const logout = async () => {
  await auth.signOut();
};