import { Badge } from "@/components/ui/badge";
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
import { useEffect, useState } from "react";

const AssetsPage = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      await AxiosClient()
        .get("/assets/my-assets")
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
          <div className="text-2xl font-bold">My Assets</div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-100">
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Condition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              return (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.description ?? "No description"}</TableCell>
                  <TableCell>
                    <Badge className="uppercase">
                      {asset.condition.replace("_", " ")}
                    </Badge>
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

export default AssetsPage;
