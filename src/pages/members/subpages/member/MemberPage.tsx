import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { Asset } from "@/types/Asset";
import { OrganizationMember } from "@/types/OrganizationMember";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronLeftCircle, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import UpdateRoleModal from "../../components/UpdateRoleModal";
import Expander from "@/components/ui/expander";

const MemberUpdateFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name is too short" }),
  lastName: z.string(),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber: z.string().refine((value) => {
    if (!value || value == "") return true;
    return /^\+\d{7,15}$/.test(value);
  }, "Invalid phone number"),
});

const MemberPage = () => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [editingEnabled, setEditingEnabled] = useState(false);

  const [refreshData, setRefreshData] = useState(false);

  const form = useForm<z.infer<typeof MemberUpdateFormSchema>>({
    resolver: zodResolver(MemberUpdateFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const [member, setMember] = useState<OrganizationMember>();

  async function onSubmit(data: z.infer<typeof MemberUpdateFormSchema>) {
    try {
      setLoading(true);
      await AxiosClient()
        .patch("/organizations/users/" + member?.id, data)
        .then(() => {
          toast({
            title: "Member Updated",
            description: "Member has been updated successfully.",
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
            description: "An error occurred while updating the member.",
            variant: "destructive",
          });
        });

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the member.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const response = await AxiosClient().get(`/organizations/users/${id}`);
        if (response.status === 200) {
          setMember(response.data);
          form.reset(response.data);
          setLoading(false);
        } else {
          setLoading(false);
          navigate("/members");
        }
      } catch (error) {
        setLoading(false);
        navigate("/members");
      }
    };
    fetchTestData();
  }, [id, navigate, setLoading, setMember, refreshData, form]);

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
          <div className="text-2xl font-bold">
            {member?.firstName} {member?.lastName}{" "}
            {user.id == member?.id ? (
              <span className="text-base text-muted-foreground font-normal">
                (You)
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        {member && (
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
                      <div className="text-sm font-medium">First Name</div>
                      <div className="text-sm">{member.firstName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Last Name</div>
                      <div className="text-sm">
                        {member.lastName ? member.lastName : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm">{member.email}</div>{" "}
                    </div>
                    <div>
                      <div className="text-sm font-medium">Phone Number</div>
                      <div className="text-sm">
                        {member.phoneNumber ? member.phoneNumber : "N/A"}
                      </div>
                    </div>
                  </>
                ) : (
                  <Form {...form}>
                    <div className="grid gap-4 mt-2 mr-2">
                      <FormItem>
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <Input
                          id="firstName"
                          type="text"
                          {...form.register("firstName")}
                        />
                        <FormMessage>
                          {form.formState.errors.firstName?.message}
                        </FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <Input
                          id="lastName"
                          type="text"
                          {...form.register("lastName")}
                        />
                        <FormMessage>
                          {form.formState.errors.lastName?.message}
                        </FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                        />
                        <FormMessage>
                          {form.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                      <FormItem>
                        <FormLabel htmlFor="phoneNumber">
                          Phone Number
                        </FormLabel>
                        <Input
                          id="phoneNumber"
                          type="text"
                          {...form.register("phoneNumber")}
                        />
                        <FormMessage>
                          {form.formState.errors.phoneNumber?.message}
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
              <div className="w-1/2 flex gap-4 flex-col">
                <div>
                  <div className="text-sm font-medium">Role</div>
                  <div className="text-sm cursor-pointer">
                    {user.role == "admin" ? (
                      <UpdateRoleModal
                        member={member}
                        refreshData={() => {
                          setRefreshData(!refreshData);
                        }}
                      >
                        <Badge className="cursor-pointer uppercase">
                          {member.role}
                        </Badge>
                      </UpdateRoleModal>
                    ) : (
                      <Badge className="cursor-pointer uppercase">
                        {member.role}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Assets</div>
                  <div className="text-sm flex gap-1 items-center">
                    {member.assets?.map((asset: Asset) => (
                      <Link
                        to={"/organization-assets/" + asset.id}
                        key={asset.id}
                      >
                        <Badge className="uppercase">{asset.name}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="p-2 mt-4">
          <Expander title="See all assigned assets">
            {member?.assets && member.assets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-100">
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.assets.map((asset) => {
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
                        <TableCell>{asset.description}</TableCell>
                        <TableCell>
                          <Badge className="uppercase">
                            {asset.condition.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="uppercase">Un-assign</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-muted-foreground text-center p-4">
                No assets assigned
              </div>
            )}
          </Expander>
        </div>
      </Card>
    </div>
  );
};

export default MemberPage;
