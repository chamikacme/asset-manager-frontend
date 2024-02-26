import NavBar from "@/components/navbar/NavBar";
import SidePanel from "@/components/sidepanel/SidePanel";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen min-w-[700px] flex flex-col">
      <div>
        <NavBar />
      </div>
      <div className="flex grow">
        <div className="hidden lg:flex md:w-1/3 lg:w-1/4 xl:w-1/5">
          <SidePanel />
        </div>
        <div className="grow bg-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
