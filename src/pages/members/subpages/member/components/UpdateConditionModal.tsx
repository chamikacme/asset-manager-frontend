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
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UpdateRoleModalProps {
  children?: ReactNode;
  refreshData: () => void;
  asset: Asset;
}

enum AssetCondition {
  WORKING = "working",
  NEEDS_MAINTENANCE = "needs_maintenance",
  NOT_WORKING = "not_working",
  DISPOSED = "disposed",
}

const UpdateAssetConditionFormSchema = z.object({
  condition: z.enum([
    AssetCondition.WORKING,
    AssetCondition.NEEDS_MAINTENANCE,
    AssetCondition.NOT_WORKING,
    AssetCondition.DISPOSED,
  ]),
});

const UpdateAssetConditionModal = ({
  children,
  refreshData,
  asset,
}: UpdateRoleModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof UpdateAssetConditionFormSchema>>({
    resolver: zodResolver(UpdateAssetConditionFormSchema),
    defaultValues: {
      condition: asset.condition as AssetCondition,
    },
  });

  async function onSubmit(
    data: z.infer<typeof UpdateAssetConditionFormSchema>
  ) {
    setLoading(true);
    await AxiosClient()
      .patch("/assets/" + asset?.id, data)
      .then(() => {
        toast({
          title: "Success",
          description: "Condition updated successfully",
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
          <DialogTitle>Update Asset Condition</DialogTitle>
          <DialogDescription>
            Update the asset condition of{" "}
            <span className="text-primary">{asset.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
          <Form {...form}>
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AssetCondition.WORKING}>
                        Working
                      </SelectItem>
                      <SelectItem value={AssetCondition.NEEDS_MAINTENANCE}>
                        Needs Maintenance
                      </SelectItem>
                      <SelectItem value={AssetCondition.NOT_WORKING}>
                        Not Working
                      </SelectItem>
                      <SelectItem value={AssetCondition.DISPOSED}>
                        Disposed
                      </SelectItem>
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
            Update Condition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAssetConditionModal;
