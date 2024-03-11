import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import Username from "@/lib/username";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ProfileUpdateFormSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().refine((value) => {
    if (!value || value == "") return true;
    return /^\+\d{7,15}$/.test(value);
  }, "Invalid phone number"),
});

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const loadSession = useAuthStore((state) => state.loadSession);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [editingEnabled, setEditingEnabled] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof ProfileUpdateFormSchema>>({
    resolver: zodResolver(ProfileUpdateFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });

  async function onSubmit(data: z.infer<typeof ProfileUpdateFormSchema>) {
    try {
      setLoading(true);

      await AxiosClient()
        .patch("/users/me", data)
        .then(() => {
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
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
            description: "An error occurred while updating your profile.",
            variant: "destructive",
          });
        });

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <div className="h-full p-2">
      <Card className="p-6 relative">
        <Pencil
          className={`absolute top-6 right-6 cursor-pointer border p-2 rounded hover:bg-primary hover:text-white hover:border-primary transition-colors ${
            editingEnabled && "bg-slate-200 border-primary text-primary"
          }`}
          size={36}
          onClick={() => setEditingEnabled(!editingEnabled)}
        />
        <div>
          <Avatar className="w-20 h-20 cursor-pointer md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto my-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl md:text-4xl lg:text-5xl">
              {Username(user.firstName, user.lastName).getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mx-auto">
          <Form {...form}>
            <div className="grid gap-4">
              <FormItem>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input
                  id="firstName"
                  type="text"
                  {...form.register("firstName")}
                  readOnly={!editingEnabled}
                />
                <FormMessage>
                  {form.formState.errors.firstName?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel htmlFor="lastName">
                  Last Name <span className="font-light">(Optional)</span>
                </FormLabel>
                <Input
                  id="lastName"
                  type="text"
                  {...form.register("lastName")}
                  readOnly={!editingEnabled}
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
                  autoComplete="email"
                  {...form.register("email")}
                  readOnly={!editingEnabled}
                />
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...form.register("phoneNumber")}
                  readOnly={!editingEnabled}
                />
                <FormMessage>
                  {form.formState.errors.phoneNumber?.message}
                </FormMessage>
              </FormItem>
              <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              {editingEnabled && (
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
              )}
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
