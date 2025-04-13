import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ErrorPage from "@/pages/ErrorPage";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "@/pages/dashboard";
import Device from "@/pages/dashboard/[slug]";
import Manager from "@/pages/manager";
import EngineerPage from "@/pages/engineer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Lazy load components for better performance
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

export const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Suspense>
      <Routes>
        {/* Root path - redirect to dashboard if logged in, otherwise to sign-in */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />

        <Route
          path="/sign-in"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <SignIn />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/sign-up"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            )
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "ENGINEER"]} />
          }
        >
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/:slug"
            element={
              <DashboardLayout>
                <Device />
              </DashboardLayout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="/managers"
            element={
              <DashboardLayout>
                <Manager />
              </DashboardLayout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
          <Route
            path="/engineers"
            element={
              <DashboardLayout>
                <EngineerPage />
              </DashboardLayout>
            }
          />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};
