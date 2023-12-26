import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, isLoggedIn, role }) {
  return isLoggedIn && allowedRoles?.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
}
