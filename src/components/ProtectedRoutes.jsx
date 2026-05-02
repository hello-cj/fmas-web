import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const role = getRole();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}