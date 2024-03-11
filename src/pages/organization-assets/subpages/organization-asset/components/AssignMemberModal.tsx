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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { Asset } from "@/types/Asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OrganizationMember } from "@/types/OrganizationMember";

interface UpdateRoleModalProps {
  children?: ReactNode;
  refreshData: () => void;
  asset: Asset;
}

const UpdateAssignedMemberFormSchema = z.object({
  assignedTo: z.number(),
});

const AssignMemberModal = ({
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
      assignedTo: asset.assignedTo?.id as unknown as number,
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
          description: "Assigned member updated successfully",
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

  const [members, setMembers] = useState<OrganizationMember[]>([]);

  useEffect(() => {
    setLoading(true);
    AxiosClient()
      .get("/organizations/users")
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, toast]);

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
          <DialogTitle>Assign User</DialogTitle>
          <DialogDescription>
            Update the assigned member for{" "}
            <span className="text-primary">{asset.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
          <Form {...form}>
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as unknown as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id as string}>
                          {member.firstName + " " + member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          </Form>
        </div>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            Assign {asset.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMemberModal;
