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
import { Asset } from "@/types/Asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { nullable, z } from "zod";

interface UpdateRoleModalProps {
  children?: ReactNode;
  refreshData: () => void;
  asset: Asset;
}

const UpdateAssignedMemberFormSchema = z.object({
  assignedTo: nullable(z.number()),
});

const UnassignMemberModal = ({
  children,
  refreshData,
  asset,
}: UpdateRoleModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof UpdateAssignedMemberFormSchema>>({
    resolver: zodResolver(UpdateAssignedMemberFormSchema),
    defaultValues: {
      assignedTo: null,
    },
  });

  async function onSubmit(
    data: z.infer<typeof UpdateAssignedMemberFormSchema>
  ) {
    setLoading(true);
    await AxiosClient()
      .patch("/assets/" + asset?.id + "/assign", data)
      .then(() => {
        toast({
          title: "Success",
          description: "Unassigned member updated successfully",
        });
        form.reset();
        setIsOpen(false);
        refreshData();
      })
      .catch((error) => {
        form.setError("root", {
          message: error.response.data.message as string,
        });
        toast({
          title: "Error",
          description: error.response.data.message,
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unassign User</DialogTitle>
          <DialogDescription>
            Unassign the member for{" "}
            <span className="text-primary">{asset.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 "></div>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            Unassign {asset.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnassignMemberModal;
