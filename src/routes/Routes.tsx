import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import AssetsPage from "@/pages/assets/AssetsPage";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import OrganizationPage from "@/pages/organization/OrganizationPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute element={<AuthLayout />} />,
    children: [
      {
        path: "/",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
  {
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/assets",
        element: <AssetsPage />,
      },
      {
        path: "/organization",
        element: <OrganizationPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
