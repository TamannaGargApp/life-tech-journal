import { create } from "zustand";
import { AuthAPI } from "@/services/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "reader" | "author" | "admin";
  is_verified: boolean;
}

interface AuthState {
  token:   string | null;
  user:    UserProfile | null;
  loading: boolean;
  setToken: (token: string) => void;
  setUser:  (user: UserProfile) => void;
  logout:   () => Promise<void>;
  refresh:  () => Promise<void>;
  init:     () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null, user: null, loading: true,
  setToken: (token) => set({ token }),
  setUser:  (user)  => set({ user }),
  logout: async () => {
    try { await AuthAPI.logout(); } catch {}
    set({ token: null, user: null });
  },
  refresh: async () => {
    try {
      const { access_token } = await AuthAPI.refresh();
      set({ token: access_token });
      const user = await AuthAPI.me(access_token);
      set({ user: user as UserProfile });
    } catch {
      set({ token: null, user: null });
    }
  },
  init: async () => {
    set({ loading: true });
    await get().refresh();
    set({ loading: false });
  },
}));
