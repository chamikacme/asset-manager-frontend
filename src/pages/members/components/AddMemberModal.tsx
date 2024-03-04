import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddMemberModalProps {
  children?: ReactNode;
}

const addMemberSchema = z.object({
  userEmail: z.string().email(),
});

const AddMemberModal = ({ children }: AddMemberModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userEmail: "",
    },
  });

  async function onSubmit(data: z.infer<typeof addMemberSchema>) {
    setLoading(true);
    await AxiosClient()
      .post("/organizations/add-member", data)
      .then(() => {
        toast({
          title: "Member added",
          description: "The member has been added to the organization",
        });
        location.reload();
      })
      .catch((error) => {
        form.setError("root", {
          message: error.response.data.message as string,
        });
        toast({
          title: "Error",
          description: "Failed to add member to the organization",
          variant: "destructive",
        });
      });

    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            The member must have an account in the platform
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
          <Form {...form}>
            <FormItem>
              <Label htmlFor="userEmail" className="text-left">
                Email
              </Label>
              <Input
                id="userEmail"
                className="col-span-3"
                {...form.register("userEmail")}
              />
              <FormMessage>
                {form.formState.errors.userEmail?.message}
              </FormMessage>
            </FormItem>

            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
            <FormItem>
              <Button
                type="submit"
                className="mx-auto w-full"
                onClick={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                Create
              </Button>
            </FormItem>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
