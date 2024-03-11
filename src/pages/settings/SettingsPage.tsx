import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const OrganizationUpdateFormSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
});

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const loadSession = useAuthStore((state) => state.loadSession);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [editingEnabled, setEditingEnabled] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof OrganizationUpdateFormSchema>>({
    resolver: zodResolver(OrganizationUpdateFormSchema),
    defaultValues: {
      name: user.organization.name,
      description: user.organization.description,
    },
  });

  async function onSubmit(data: z.infer<typeof OrganizationUpdateFormSchema>) {
    try {
      setLoading(true);

      await AxiosClient()
        .patch("/organizations/me", data)
        .then(() => {
          toast({
            title: "Organization Updated",
            description: "Your organization has been updated successfully.",
          });
          setEditingEnabled(false);
          loadSession();
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
            description: "An error occurred while updating your organization.",
            variant: "destructive",
          });
        });

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your organization.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <div className="h-full p-2">
      <Card className="p-6 pt-4 relative">
        {user.role == "admin" && (
          <Pencil
            className={`absolute top-6 right-6 cursor-pointer border p-2 rounded hover:bg-primary hover:text-white hover:border-primary transition-colors ${
              editingEnabled && "bg-slate-200 border-primary text-primary"
            }`}
            size={36}
            onClick={() => setEditingEnabled(!editingEnabled)}
          />
        )}
        <div className="text-2xl font-bold pb-4">Settings</div>
        <div className="mx-auto">
          <div className="flex flex-col gap-4 relative">
            {!editingEnabled ? (
              <>
                <div>
                  <div className="text-sm font-medium">Organization Name</div>
                  <div className="text-sm">{user.organization?.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Description</div>
                  <div className="text-sm">
                    {user.organization?.description == null ||
                    user.organization?.description == ""
                      ? "No description"
                      : user.organization?.description}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Updated at</div>
                  <div className="text-sm">
                    {new Date(user.organization?.updatedAt).toLocaleString(
                      undefined,
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </div>{" "}
                </div>
                <div>
                  <div className="text-sm font-medium">Created at</div>
                  <div className="text-sm">
                    {new Date(user.organization?.createdAt).toLocaleString(
                      undefined,
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </div>{" "}
                </div>
              </>
            ) : (
              <Form {...form}>
                <div className="grid gap-4 mr-2">
                  <FormItem>
                    <FormLabel htmlFor="name">Asset Name</FormLabel>
                    <Input id="name" type="text" {...form.register("name")} />
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                  <FormItem>
                    <FormLabel htmlFor="description">
                      Description <span className="font-light">(Optional)</span>
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
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
