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
import AdminRoute from "./AdminRoutes";
import MembersPage from "@/pages/members/MembersPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import OrganizationAssetsPage from "@/pages/organization-assets/OrganizationAssetsPage";

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
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    element: <AdminRoute element={<MainLayout />} />,
    children: [
      {
        path: "/members",
        element: <MembersPage />,
      },
      {
        path: "/organization-assets",
        element: <OrganizationAssetsPage />,
      },
    ],
  },
]);

export default router;
