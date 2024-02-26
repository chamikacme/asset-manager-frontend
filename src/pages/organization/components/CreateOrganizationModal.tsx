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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateOrganizationModalProps {
  children?: ReactNode;
}

const formCreateOrganizationSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
});

const CreateOrganizationModal = ({
  children,
}: CreateOrganizationModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loadSession = useAuthStore((state) => state.loadSession);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formCreateOrganizationSchema>>({
    resolver: zodResolver(formCreateOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formCreateOrganizationSchema>) {
    try {
      setLoading(true);
      await AxiosClient()
        .post("/organizations", data)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          form.setError("root", {
            message: error as string,
          });
          console.error(error);
        });
      toast({
        title: "Organization created",
        description: "You're now the admin of the organization",
      });
      setLoading(false);
      await loadSession();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
      form.setError("root", {
        message: error as string,
      });
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            You'll be the admin of the organization
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <FormItem>
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...form.register("name")}
              />
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                {...form.register("description")}
              />
              <FormMessage>
                {form.formState.errors.description?.message}
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

export default CreateOrganizationModal;
