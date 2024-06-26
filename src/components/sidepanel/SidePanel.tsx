import useAuthStore from "@/store/authStore";
import {
  Building,
  LayoutPanelLeft,
  Settings,
  TabletSmartphone,
  User,
  Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const SidePanel = () => {
  const location = useLocation();
  const { pathname } = location;

  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-slate-200 grow">
      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <nav className="py-4 px-4">
          <div>
            <ul className="mb-6 flex flex-col">
              <li>
                <h3 className="mb-2 ml-2 mt-2 text-sm font-semibold border-b border-slate-300 text-slate-600">
                  Dashboard
                </h3>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                    pathname.includes("dashboard") &&
                    "bg-primary text-primary-foreground"
                  }`}
                >
                  <LayoutPanelLeft className="h-5 w-5" />
                  Overview
                </NavLink>
              </li>
              <li>
                <h3 className="mb-2 ml-2 mt-2 text-sm font-semibold border-b border-slate-300 text-slate-600">
                  Organization
                </h3>
              </li>
              <li>
                <NavLink
                  to="/organization"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                    pathname.split("/")[1] == "organization" &&
                    "bg-primary text-primary-foreground"
                  }`}
                >
                  <Building className="h-5 w-5" />
                  Organization
                </NavLink>
              </li>
              {(user.role == "admin" || user.role == "manager") && (
                <>
                  <li>
                    <NavLink
                      to="/members"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                        pathname.includes("members") &&
                        "bg-primary text-primary-foreground"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                      Members
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/organization-assets"
                      className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                        pathname.includes("/organization-assets") &&
                        "bg-primary text-primary-foreground"
                      }`}
                    >
                      <TabletSmartphone className="h-5 w-5" />
                      Assets
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <h3 className="mb-2 ml-2 mt-2 text-sm font-semibold border-b border-slate-300 text-slate-600">
                  User
                </h3>
              </li>
              <li>
                <NavLink
                  to="/assets"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                    pathname.split("/")[1] == "assets" &&
                    "bg-primary text-primary-foreground"
                  }`}
                >
                  <TabletSmartphone className="h-5 w-5" />
                  My Assets
                </NavLink>
              </li>
              <li>
                <h3 className="mb-2 ml-2 mt-2 text-sm font-semibold border-b border-slate-300 text-slate-600">
                  Settings
                </h3>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                    pathname.includes("profile") &&
                    "bg-primary text-primary-foreground"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Profile
                </NavLink>
              </li>
              {(user.role == "admin" || user.role == "manager") && (
                <li>
                  <NavLink
                    to="/settings"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-3 font-medium ease-in-out ${
                      pathname.includes("settings") &&
                      "bg-primary text-primary-foreground"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidePanel;
