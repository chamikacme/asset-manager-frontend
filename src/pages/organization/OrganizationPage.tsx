import { Card } from "@/components/ui/card";
import useAuthStore from "@/store/authStore";
import { Laptop, PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateOrganizationModal from "./components/CreateOrganizationModal";

const OrganizationPage = () => {
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  return (
    <div className="p-2 grid gap-2">
      {user.organization ? (
        <>
          <Card className="p-6 text-white bg-primary">
            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              <div>
                <div className="text-sm">Organization Name:</div>
                <div className="text-xl">{user.organization.name}</div>
              </div>
              <div>
                <div className="text-sm">Role:</div>
                <div className="text-xl">{user.role.toLocaleUpperCase()}</div>
              </div>
            </div>
          </Card>
          {user.role === "admin" || user.role === "manager" ? (
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary group">
                <Users size={75} />
                <div className="text-2xl font-semibold mt-2">Members</div>
                <div className="font-normal text-sm text-slate-400 group-hover:text-primary">
                  View organization members
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
                  View organization assets
                </div>
              </Card>
            </div>
          ) : (
            <Card
              className="p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary group"
              onClick={() => {
                navigate("/assets");
              }}
            >
              <Laptop size={75} />
              <div className="text-2xl font-semibold mt-2">Assets</div>
              <div className="font-normal text-sm text-slate-400 group-hover:text-primary">
                View my assets
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-6">
          <div>Currently, you're not a part of any organization.</div>
          <div className="flex flex-col items-center gap-2 my-4">
            <CreateOrganizationModal>
              <div className="flex flex-col gap-2 cursor-pointer items-center group">
                <PlusCircle size={50} className="text-primary" />
                <div className="text-primary group-hover:underline underline-offset-2">
                  Create an organization
                </div>
              </div>
            </CreateOrganizationModal>
            <div className="flex items-center gap-4">
              <div className="w-[120px] border-b"></div>
              <div className="text-sm">or</div>
              <div className="w-[120px] border-b"></div>
            </div>

            <div className="flex flex-col gap-1 cursor-pointer items-center">
              <div className="text-primary hover:underline underline-offset-2">
                Join an organization
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrganizationPage;
