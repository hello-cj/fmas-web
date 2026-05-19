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
  if (!user) return null;

  return (
    user.role ||
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    null
  );
};

export const isAuthenticated = () => {
  return !!getToken();
};