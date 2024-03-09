import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Asset } from "@/types/Asset";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddAssetModal from "./components/AddAssetModal";
import RemoveAssetModal from "./components/RemoveAssetModal";

const OrganizationAssetsPage = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      await AxiosClient()
        .get("/assets")
        .then((response) => {
          const data: Asset[] = response.data;
          setAssets(data);
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
    fetchAssets();
  }, [toast, setLoading, setRefreshData, refreshData]);

  return (
    <div className="grid gap-2 p-2">
      <Card className="p-4">
        <div className="p-2 pt-0 pe-0 flex justify-between items-center">
          <div className="text-2xl font-bold">Assets</div>
          <AddAssetModal
            refreshData={() => {
              setRefreshData(!refreshData);
            }}
          >
            <Button size={"sm"}>Add Asset</Button>
          </AddAssetModal>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-100">
              <TableHead>Name</TableHead>
              <TableHead>Assigned to</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              return (
                <TableRow key={asset.id}>
                  <TableCell>
                    <Link
                      to={"/organization-assets/" + asset.id}
                      className="hover:underline"
                    >
                      {asset.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {asset?.assignedTo ? (
                      <Link to={"/members/" + asset.assignedTo.id}>
                        <Badge className="uppercase">
                          {asset.assignedTo.firstName}{" "}
                          {asset.assignedTo.lastName}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge className="uppercase">UNASSIGNED</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className="uppercase">
                      {asset.condition.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RemoveAssetModal
                      asset={asset}
                      refreshData={() => {
                        setRefreshData(!refreshData);
                      }}
                    >
                      <Trash2 className="w-5 h-5 cursor-pointer" />
                    </RemoveAssetModal>
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

export default OrganizationAssetsPage;
