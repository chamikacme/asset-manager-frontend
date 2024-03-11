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
import { ReactNode, useState } from "react";

interface RemoveAssetModalProps {
  children?: ReactNode;
  asset: Asset;
  refreshData: () => void;
}

const RemoveAssetModal = ({
  children,
  asset,
  refreshData,
}: RemoveAssetModalProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const isPageLoading = useLoadingStore((state) => state.isPageLoading);

  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  async function handleRemoveAsset(id: string) {
    setLoading(true);
    await AxiosClient()
      .delete("/assets/" + id)
      .then(() => {
        toast({
          title: "Asset removed",
          description: "The asset has been removed from the organization",
        });
        refreshData();
        setIsOpen(false);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to remove the asset from the organization",
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
          <DialogTitle>Remove Asset</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="text-primary">{asset.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleRemoveAsset(asset.id)}
            disabled={isPageLoading}
          >
            Remove {asset.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveAssetModal;
