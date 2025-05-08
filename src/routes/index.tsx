import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ErrorPage from "@/pages/ErrorPage";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";

// Admin
import Dashboard from "@/pages/admin/dashboard";
import Device from "@/pages/admin/dashboard/[slug]";
import Manager from "@/pages/admin/manager";
import EngineerPage from "@/pages/admin/engineer";

// Manager
import ManagerDashboardPage from "@/pages/manager/dashboard";
import ManagerDeviceDetails from "@/pages/manager/dashboard/slug";
import ManagerEngineerPage from "@/pages/manager/engineer";

// Engineer
import Engineer from "@/pages/engineer/index";
import DeviceDetails from "@/components/engineer/engineer_dashboard/DeviceDetails";

// Lazy load components for better performance
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

export const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <Suspense>
      <Routes>
        {/* Root path - redirect to dashboard if logged in, otherwise to sign-in */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user?.role === "MANAGER" ? (
                <Navigate to="/manager/dashboard" replace />
              ) : user?.role === "ENGINEER" ? (
                <Navigate to="/engineer/dashboard" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />

        <Route
          path="/sign-in"
          element={
            isAuthenticated ? (
              user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user?.role === "MANAGER" ? (
                <Navigate to="/manager/dashboard" replace />
              ) : user?.role === "ENGINEER" ? (
                <Navigate to="/engineer/dashboard" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
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
              user?.role === "ADMIN" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user?.role === "MANAGER" ? (
                <Navigate to="/manager/dashboard" replace />
              ) : user?.role === "ENGINEER" ? (
                <Navigate to="/engineer/dashboard" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
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
          {/* <Route
            path="/settings"
            element={
              <DashboardLayout>
                <div>Settings</div>
                </DashboardLayout>
            }
          /> */}
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route
            path="/admin/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/dashboard/:slug"
            element={
              <DashboardLayout>
                <Device />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/managers"
            element={
              <DashboardLayout>
                <Manager />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/engineers"
            element={
              <DashboardLayout>
                <EngineerPage />
              </DashboardLayout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
          <Route
            path="/manager/dashboard"
            element={
              <DashboardLayout>
                <ManagerDashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/manager/dashboard/:slug"
            element={
              <DashboardLayout>
                <ManagerDeviceDetails />
              </DashboardLayout>
            }
          />
          <Route
            path="/manager/engineer"
            element={
              <DashboardLayout>
                <ManagerEngineerPage />
              </DashboardLayout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["ENGINEER"]} />}>
          <Route
            path="/engineer/dashboard"
            element={
              <DashboardLayout>
                <Engineer />
              </DashboardLayout>
            }
          />
          <Route
            path="/engineer/dashboard/:slug"
            element={
              <DashboardLayout>
                <DeviceDetails />
              </DashboardLayout>
            }
          />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};
