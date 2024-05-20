import { create } from "zustand";

interface UserStore {
  userId: string;
  setUserId: (userId: string) => void;
  removeUserId: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: "",
  setUserId: (userId) => set({ userId: userId }),
  removeUserId: () => set({ userId: "" }),
}));
