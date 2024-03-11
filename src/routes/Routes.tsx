import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import AssetsPage from "@/pages/assets/AssetsPage";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import MembersPage from "@/pages/members/MembersPage";
import OrganizationAssetsPage from "@/pages/organization-assets/OrganizationAssetsPage";
import OrganizationAssetPage from "@/pages/organization-assets/subpages/organization-asset/OrganizationAssetPage";
import OrganizationPage from "@/pages/organization/OrganizationPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";
import { createBrowserRouter } from "react-router-dom";
import AdminRoute from "./AdminRoutes";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MemberPage from "@/pages/members/subpages/member/MemberPage";

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
        path: "/members/:id",
        element: <MemberPage />,
      },
      {
        path: "/organization-assets",
        element: <OrganizationAssetsPage />,
      },
      {
        path: "/organization-assets/:id",
        element: <OrganizationAssetPage />,
      },
    ],
  },
]);

export default router;
