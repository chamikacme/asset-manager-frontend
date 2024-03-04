import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import useLoadingStore from "@/store/loadingStore";
import { OrganizationMember } from "@/types/OrganizationMember";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import AddMemberModal from "./components/AddMemberModal";

const MembersPage = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

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
  }, [toast, setLoading]);

  return (
    <div className="grid gap-2 p-2">
      <Card className="p-4">
        <div className="p-2 pt-0 pe-0 flex justify-between items-center">
          <div className="text-2xl font-bold">Members</div>
          <AddMemberModal>
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
                  <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge>{member.role.toLocaleUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical size={24} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem>Assets</DropdownMenuItem>
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
