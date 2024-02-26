import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Username from "@/lib/username";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { Link } from "react-router-dom";

const AvatarDropdown = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const handleLogout = () => {
    try {
      setLoading(true);
      logout();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="cursor-pointer flex items-end gap-2"
      >
        <div>
          <div className="hidden lg:flex flex-col text-xs">
            <div>{Username(user.firstName, user.lastName).getShortName()}</div>
            <div className="text-gray-500">
              {Username(user.email).getShortName()}
            </div>
          </div>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {Username(user.firstName, user.lastName).getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings/profile">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div onClick={handleLogout}>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
