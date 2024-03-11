import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { OrganizationMember } from "@/types/OrganizationMember";
import { ReactNode, useState } from "react";

interface RemoveMemberModalProps {
  children?: ReactNode;
  member: OrganizationMember;
  refreshData: () => void;
}

const RemoveMemberModal = ({ children, member,refreshData }: RemoveMemberModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const isPageLoading = useLoadingStore((state) => state.isPageLoading);

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  async function handleRemoveUser(userId: string) {
    setLoading(true);
    await AxiosClient()
      .post("/organizations/remove-member", { userId: userId })
      .then(() => {
        toast({
          title: "Member removed",
          description: "The member has been removed from the organization",
        });
        refreshData();
        setIsOpen(false);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to remove the member to the organization",
          variant: "destructive",
        });
      });
    setLoading(false);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="text-primary">
              {member.firstName} {member.lastName}
            </span>{" "}
            from the organization?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleRemoveUser(member.id)}
            disabled={isPageLoading}
          >
            Remove {member.firstName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMemberModal;
