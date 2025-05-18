import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../../shared/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        localStorage.setItem("token", token);
        set({ token, user, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
