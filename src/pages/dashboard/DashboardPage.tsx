import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Username from "@/lib/username";
import useAuthStore from "@/store/authStore";
import { Building, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="p-2 flex flex-col gap-2">
      <Card className="p-6 flex justify-between gap-2 bg-primary">
        <div>
          <h1 className="text-2xl font-semibold text-primary-foreground">
            {`${
              new Date().getHours() < 12
                ? "Good morning"
                : new Date().getHours() < 18
                ? "Good afternoon"
                : "Good evening"
            }, ${user?.firstName}!`}
          </h1>
          <p className="text-sm text-primary-foreground">Welcome!</p>
          <div className="mt-4 text-primary-foreground">
            <div className="text-sm italic">You're logged in as:</div>
            <div className="font-bold text-lg">
              {Username(user.firstName, user.lastName).getFullName()}
            </div>
            <div className="text-sm">{user.email}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Avatar className="w-20 h-20 mx-6 cursor-pointer md:w-24 md:h-24 md:mx-12 lg:w-28 lg:h-28 lg:mx-10">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl md:text-4xl lg:text-5xl">
              {Username(user.firstName, user.lastName).getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <Card
          className="p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary group"
          onClick={() => {
            navigate("/organization");
          }}
        >
          <Building size={75} />
          <div className="text-2xl font-semibold mt-2">Organization</div>
          <div className="font-normal text-sm text-slate-400 group-hover:text-primary">
            View organization details
          </div>
        </Card>
        <Card
          className="p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary group"
          onClick={() => {
            navigate("/assets");
          }}
        >
          <Laptop size={75} />
          <div className="text-2xl font-semibold mt-2">Assets</div>
          <div className="font-normal text-sm text-slate-400 group-hover:text-primary">
            View asset details
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
