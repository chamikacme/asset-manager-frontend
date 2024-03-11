import AxiosClient from "@/lib/axios-client/axiosClient";
import { Organization } from "@/types/Organization";
import { signUpformSchema } from "@/types/SignUpFormSchema";
import { z } from "zod";
import { create } from "zustand";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  organization: Organization;
  isLogged: boolean;
}

interface AuthStore {
  user: User;
  isLoading: boolean;
  signup: (data: z.infer<typeof signUpformSchema>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadSession: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: {} as User,
  isLoading: true,

  signup: async (data: z.infer<typeof signUpformSchema>) => {
    await AxiosClient()
      .post("/auth/signup", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        const user: User = response.data.user;
        user.isLogged = true;

        localStorage.setItem("TOKEN", response.data.token);
        set({
          user: user,
          isLoading: false,
        });
      })
      .catch((error) => {
        set({ user: {} as User, isLoading: false });
        throw error.response.data.message;
      });
  },

  login: async (email: string, password: string) => {
    await AxiosClient()
      .post("/auth/signin", {
        email: email,
        password: password,
      })
      .then((response) => {
        const user: User = response.data.user;
        user.isLogged = true;

        localStorage.setItem("TOKEN", response.data.token);
        set({
          user: user,
          isLoading: false,
        });
      })
      .catch((error) => {
        set({ user: {} as User, isLoading: false });
        throw error.response.data.message;
      });
  },

  logout: () => {
    const updatedUser: User = {} as User;
    set({ user: updatedUser });
    localStorage.removeItem("TOKEN");
  },

  loadSession: () => {
    if (!localStorage.getItem("TOKEN")) {
      set({ user: {} as User, isLoading: false });
      return;
    }
    AxiosClient()
      .get("/auth/validate-user")
      .then((response) => {
        const user: User = response.data;
        user.isLogged = true;
        set({
          user: user,
          isLoading: false,
        });
      })
      .catch((error) => {
        error.response.status === 401 && localStorage.removeItem("TOKEN");
        set({ user: {} as User, isLoading: false });
      });
  },
}));

export default useAuthStore;
