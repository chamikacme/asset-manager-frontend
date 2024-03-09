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
import { Form, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddAssetModalProps {
  children?: ReactNode;
  refreshData: () => void;
}

const addAssetSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name is too short"),
  description: z.string().optional(),
});

const AddAssetModal = ({ children, refreshData }: AddAssetModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof addAssetSchema>>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof addAssetSchema>) {
    setLoading(true);
    await AxiosClient()
      .post("/assets", data)
      .then(() => {
        toast({
          title: "Asset added",
          description: "Then asset has been added to the organization",
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
          description: "Failed to add asset to the organization",
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
          <DialogTitle>Add Asset</DialogTitle>
          <DialogDescription>
            Add a new asset for your organization
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
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
                Description <span className="font-light">(Optional)</span>
              </Label>
              <Input
                id="description"
                className="col-span-3"
                {...form.register("description")}
              />
            </FormItem>
            <FormMessage>
              {form.formState.errors.description?.message}
            </FormMessage>

            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          </Form>
        </div>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            Add Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetModal;
