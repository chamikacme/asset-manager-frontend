import Logo from "@/components/logo/Logo";
import { Link } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown";
import SideDrawer from "./SideDrawer";

const NavBar = () => {
  return (
    <div className="px-6 sm:px-12 py-4 flex items-center justify-between shadow bg-slate-300">
      <div className="flex lg:hidden items-center justify-start p-2">
        <SideDrawer />
      </div>
      <div className="flex-1 flex justify-center lg:justify-start">
        <Link to="/dashboard">
          <Logo />
        </Link>
      </div>
      <div className="flex justify-end items-center lg:flex-1">
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default NavBar;
