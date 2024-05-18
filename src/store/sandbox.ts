import create from "zustand";

interface SandboxStore {
  sandboxUrl: string;
  setSandboxUrl: (url: string) => void;
  removeSandboxUrl: () => void;
}

export const useSandboxStore = create<SandboxStore>((set) => ({
  sandboxUrl: "",
  setSandboxUrl: (url) => set({ sandboxUrl: url }),
  removeSandboxUrl: () => set({ sandboxUrl: "" }),
}));
