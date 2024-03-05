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
  FormDescription,
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
import { OrganizationMember } from "@/types/OrganizationMember";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UpdateRoleModalProps {
  children?: ReactNode;
  refreshData: () => void;
  member: OrganizationMember;
}

type Role = "admin" | "manager" | "member";

const addMemberSchema = z.object({
  role: z.enum(["admin", "manager", "member"]),
});

const UpdateRoleModal = ({
  children,
  refreshData,
  member,
}: UpdateRoleModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      role: (member.role as Role) || "member",
    },
  });

  async function onSubmit(data: z.infer<typeof addMemberSchema>) {
    setLoading(true);
    await AxiosClient()
      .post("/organizations/update-role", {
        id: member.id,
        role: data.role,
      })
      .then(() => {
        toast({
          title: "Success",
          description: "Role updated successfully",
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
          <DialogTitle>Update Role</DialogTitle>
          <DialogDescription>
            Update the role of the member in the organization
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
          <Form {...form}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Note: <br />
                    Admins have full access to the organization including adding
                    and removing of existing admins and managers.
                  </FormDescription>
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
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoleModal;
