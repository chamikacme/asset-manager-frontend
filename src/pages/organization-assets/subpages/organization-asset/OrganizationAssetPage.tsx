import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { Asset } from "@/types/Asset";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronLeftCircle, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import UpdateAssetConditionModal from "./components/UpdateConditionModal";

const AssetUpdateFormSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
});

const AssetPage = () => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { toast } = useToast();

  const [editingEnabled, setEditingEnabled] = useState(false);

  const [refreshData, setRefreshData] = useState(false);

  const form = useForm<z.infer<typeof AssetUpdateFormSchema>>({
    resolver: zodResolver(AssetUpdateFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [asset, setAsset] = useState<Asset>();

  async function onSubmit(data: z.infer<typeof AssetUpdateFormSchema>) {
    try {
      setLoading(true);
      await AxiosClient()
        .patch("/assets/" + asset?.id, data)
        .then(() => {
          toast({
            title: "Asset Updated",
            description: "Asset has been updated successfully.",
          });
          setEditingEnabled(false);
          setRefreshData(!refreshData);
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
              form.setError("root", {
                message: error.response.data.message[0],
              });
            }
          }
          toast({
            title: "Error",
            description: "An error occurred while updating the asset.",
            variant: "destructive",
          });
        });

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the asset.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const response = await AxiosClient().get(`/assets/${id}`);
        if (response.status === 200) {
          setAsset(response.data);
          form.reset(response.data);
          setLoading(false);
        } else {
          setLoading(false);
          navigate("/organization-assets");
        }
      } catch (error) {
        setLoading(false);
        navigate("/organization-assets");
      }
    };
    fetchTestData();
  }, [id, navigate, setLoading, setAsset, refreshData, form]);

  return (
    <div className="grid gap-2 p-2">
      <Card className="p-4">
        <div
          className="p-2 pt-0 pe-0 flex justify-start gap-1 items-center cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ChevronLeftCircle size={16} />
          <div className="text-base font-semibold">Back</div>
        </div>
        <div className="p-2 pt-0 pe-0 flex justify-between items-center">
          <div className="text-2xl font-bold">{asset?.name}</div>
        </div>
        {asset && (
          <>
            <div className="flex gap-4 p-2">
              <div className="w-1/2 flex flex-col gap-4 relative">
                <Pencil
                  className={`absolute top-0 right-2 cursor-pointer border p-2 rounded hover:bg-primary hover:text-white hover:border-primary transition-colors ${
                    editingEnabled && "bg-slate-200 border-primary text-primary"
                  }`}
                  size={36}
                  onClick={() => setEditingEnabled(!editingEnabled)}
                />
                {!editingEnabled ? (
                  <>
                    <div>
                      <div className="text-sm font-medium">Asset Name</div>
                      <div className="text-sm">{asset?.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Description</div>
                      <div className="text-sm">
                        {asset?.description == null || asset?.description == ""
                          ? "No description"
                          : asset?.description}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Updated at</div>
                      <div className="text-sm">
                        {new Date(asset?.updatedAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>{" "}
                    </div>
                    <div>
                      <div className="text-sm font-medium">Created at</div>
                      <div className="text-sm">
                        {new Date(asset?.createdAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>{" "}
                    </div>
                    <div>
                      <div className="text-sm font-medium">Created by</div>
                      <div className="text-sm">
                        {asset?.createdBy.firstName} {asset?.createdBy.lastName}
                      </div>
                    </div>
                  </>
                ) : (
                  <Form {...form}>
                    <div className="grid gap-4 mt-2 mr-2">
                      <FormItem>
                        <FormLabel htmlFor="name">Asset Name</FormLabel>
                        <Input
                          id="name"
                          type="text"
                          {...form.register("name")}
                        />
                        <FormMessage>
                          {form.formState.errors.name?.message}
                        </FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel htmlFor="description">
                          Description{" "}
                          <span className="font-light">(Optional)</span>
                        </FormLabel>
                        <Textarea
                          id="description"
                          {...form.register("description")}
                        />
                        <FormMessage>
                          {form.formState.errors.description?.message}
                        </FormMessage>
                      </FormItem>

                      <FormMessage>
                        {form.formState.errors.root?.message}
                      </FormMessage>

                      <div className="flex gap-2">
                        <FormItem>
                          <Button
                            className="w-40"
                            onClick={form.handleSubmit(onSubmit)}
                          >
                            Save
                          </Button>
                        </FormItem>
                        <FormItem>
                          <Button
                            className="w-40"
                            onClick={() => {
                              form.reset();
                              setEditingEnabled(false);
                            }}
                            variant={"outline"}
                          >
                            Cancel
                          </Button>
                        </FormItem>
                      </div>
                    </div>
                  </Form>
                )}
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <div>
                  <div className="text-sm font-medium">Assigned to</div>
                  <div className="text-sm flex gap-1 items-center">
                    {asset?.assignedTo ? (
                      <>
                        <Link to={"/members/" + asset.assignedTo.id}>
                          <Badge className="uppercase">
                            {asset.assignedTo.firstName}{" "}
                            {asset.assignedTo.lastName}
                          </Badge>
                        </Link>
                        <div className="text-xs gap-0.5 flex">
                          (
                          <span className="hover:underline cursor-pointer text-primary">
                            Change
                          </span>
                          ·
                          <span className="hover:underline cursor-pointer text-primary">
                            Un-assign
                          </span>
                          )
                        </div>
                      </>
                    ) : (
                      <>
                        <Badge className="uppercase">UNASSIGNED</Badge>
                        <div className="text-xs gap-0.5 flex">
                          (
                          <span className="hover:underline cursor-pointer text-primary">
                            Assign
                          </span>
                          )
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm">
                    <UpdateAssetConditionModal
                      asset={asset}
                      refreshData={() => {
                        setRefreshData(!refreshData);
                      }}
                    >
                      <Badge className="cursor-pointer uppercase">
                        {asset?.condition.replace("_", " ")}
                      </Badge>
                    </UpdateAssetConditionModal>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AssetPage;
