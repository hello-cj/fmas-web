import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const isAuthenticated = () => {
  return !!getToken();
};