import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/store/slices/auth/authTypes";
import { getCookie } from "@/utils/cookies";
// import Loading from "@/components/ui/Loading";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const token = getCookie("token");

  // Show loading state while checking authentication
  // if (isLoading) {
  //   return <Loading />;
  // }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // If no roles specified, render children or Outlet
  if (!allowedRoles) {
    return children || <Outlet />;
  }

  // If user data is not available yet, show loading
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user's role is allowed
  if (allowedRoles.includes(user?.role)) {
    return children || <Outlet />;
  }

  // If role is not allowed, redirect to dashboard
  return (
    <>
      {user?.role === "ADMIN" && <Navigate to="/admin/dashboard" replace />}
      {user?.role === "MANAGER" && (
        <Navigate to="/manager/dashboard" replace />
      )}
      {user?.role === "ENGINEER" && (
        <Navigate to="/engineer/dashboard" replace />
      )}
    </>
  );
}
