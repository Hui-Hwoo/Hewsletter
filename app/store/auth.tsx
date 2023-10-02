import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  email: string;
  uid: string;
  isSignIn: boolean;
  login: (email: string, uid: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: "",
        email: "",
        uid: "",
        isSignIn: false,
        login: (email, uid) => {
          set({ email, uid, isSignIn: true });
        },
        reset: () => {
          set({ email: "", uid: "", isSignIn: false });
        },
      }),
      { name: "authStore" },
    ),
    {
      name: "authStore",
    },
  ),
);
