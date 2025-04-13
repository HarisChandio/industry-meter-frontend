import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/store/slices/auth/authTypes";
import Loading from "@/components/ui/Loading";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  console.log("isLoading", isLoading);

  // Show loading state while checking authentication
  // if (isLoading) {
  //   return <Loading />;
  // }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
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
  return <Navigate to="/dashboard" replace />;
}
