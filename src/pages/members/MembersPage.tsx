import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { OrganizationMember } from "@/types/OrganizationMember";
import { Eye, Laptop, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import AddMemberModal from "./components/AddMemberModal";
import RemoveMemberModal from "./components/RemoveMemberModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateRoleModal from "./components/UpdateRoleModal";

const MembersPage = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);

  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      await AxiosClient()
        .get("/organizations/users")
        .then((response) => {
          const data: OrganizationMember[] = response.data;
          setMembers(data);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.response.data.message,
            variant: "destructive",
          });
        });
      setLoading(false);
    };
    fetchMembers();
  }, [toast, setLoading, setRefreshData, refreshData]);

  return (
    <div className="grid gap-2 p-2">
      <Card className="p-4">
        <div className="p-2 pt-0 pe-0 flex justify-between items-center">
          <div className="text-2xl font-bold">Members</div>
          <AddMemberModal
            refreshData={() => {
              setRefreshData(!refreshData);
            }}
          >
            <Button size={"sm"}>Add Member</Button>
          </AddMemberModal>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-100">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.firstName} {member.lastName}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {user.role == "admin" ? (
                      <UpdateRoleModal
                        member={member}
                        refreshData={() => {
                          setRefreshData(!refreshData);
                        }}
                      >
                        <Badge className="cursor-pointer uppercase">
                          {member.role}
                        </Badge>
                      </UpdateRoleModal>
                    ) : (
                      <Badge className="cursor-pointer uppercase">
                        {member.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-3 items-center justify-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Eye className="w-5 h-5 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Laptop className="w-5 h-5 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Assets</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {user.role == "admin" && user.id != member.id && (
                      <RemoveMemberModal
                        member={member}
                        refreshData={() => {
                          setRefreshData(!refreshData);
                        }}
                      >
                        <UserMinus className="w-5 h-5 cursor-pointer" />
                      </RemoveMemberModal>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default MembersPage;
