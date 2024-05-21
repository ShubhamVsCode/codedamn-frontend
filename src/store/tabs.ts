import { create } from "zustand";

interface ITab {
  path: string;
  name: string;
}

interface TabsState {
  tabs: ITab[];
  activeTab: string | null;
  addTab: (tab: ITab) => void;
  removeTab: (path: string) => void;
  setActiveTab: (path: string) => void;
}

export const useTabsStore = create<TabsState>((set) => ({
  tabs: [],
  activeTab: null,
  addTab: (tab) =>
    set((state) => {
      if (!state.tabs.find((t) => t.path === tab.path)) {
        return { tabs: [...state.tabs, tab], activeTab: tab.path };
      }
      return state;
    }),
  removeTab: (path) =>
    set((state) => ({
      tabs: state.tabs.filter((tab) => tab.path !== path),
      activeTab: state.activeTab === path ? null : state.activeTab,
    })),
  setActiveTab: (path) => set(() => ({ activeTab: path })),
}));
