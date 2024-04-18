import { create } from "zustand";

interface TabsState {
  tabs: IFile[];
  selectedTabId: string;
  openTab: (file: IFile) => void;
  closeTab: (_id: string) => void;
  changeSelectedTab: (_id: string) => void;
  selectedTab: () => IFile | undefined;
  updateContent: (content: string) => void;
}

export const useTabsStore = create<TabsState>()((set, get) => ({
  tabs: [],
  selectedTabId: "",
  openTab: (file: IFile) =>
    set((state) => {
      if (state.tabs.findIndex((tab) => tab._id === file._id) !== -1) {
        return { selectedTabId: file._id };
      }

      return { tabs: [...state.tabs, file], selectedTabId: file._id };
    }),
  closeTab: (_id: string) =>
    set((state) => ({ tabs: state.tabs.filter((tab) => tab._id !== _id) })),
  changeSelectedTab: (_id: string) => set((state) => ({ selectedTabId: _id })),
  selectedTab: () => get().tabs.find((tab) => tab._id === get().selectedTabId),
  updateContent: (content: string) =>
    set((state) => {
      const index = state.tabs.findIndex(
        (tab) => tab._id === state.selectedTabId,
      );
      state.tabs[index].content = content;
      return { tabs: state.tabs };
    }),
}));
