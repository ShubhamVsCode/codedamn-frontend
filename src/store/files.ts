import { create } from "zustand";

interface FilesState {
  files: IFileStructure;
  setFiles: (files: IFileStructure) => void;
  // addFile: (file: IFile, parentId: string) => void;
  removeFile: (_id: string) => void;
  updateFile: (file: IFile) => void;
}

export const useFilesStore = create<FilesState>()((set) => ({
  files: [],
  setFiles: (files: IFileStructure) => set(() => ({ files })),
  // addFile: (file: IFile, parentId: string) =>
  //   set((state) => {
  //     const parent = state.files.find((f) => f._id === parentId);
  //     if (parent) {
  //       parent.children = [...(parent.children || []), file];
  //       return { files: [...state.files] };
  //     }
  //     return state;
  //   }),
  removeFile: (_id: string) =>
    set((state) => ({ files: state.files.filter((file) => file._id !== _id) })),
  updateFile: (file: IFile) => {
    set((state) => ({
      files: state.files.map((f) => (f._id === file._id ? file : f)),
    }));
  },
}));
