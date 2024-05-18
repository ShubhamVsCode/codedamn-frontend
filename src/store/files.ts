import { create } from "zustand";

interface FilesState {
  files: IFile[];
  addFile: (file: IFile) => void;
  removeFile: (_id: string) => void;
  setFiles: (files: IFile[]) => void;
}

export const useFilesStore = create<FilesState>()((set) => ({
  files: [],
  addFile: (file: IFile) => set((state) => ({ files: [...state.files, file] })),
  updateFile: (file: IFile) => {
    set((state) => ({
      files: state.files.map((f) => (f._id === file._id ? file : f)),
    }));
  },
  removeFile: (_id: string) =>
    set((state) => ({ files: state.files.filter((file) => file._id !== _id) })),
  setFiles: (files: IFile[]) => set((state) => ({ files })),
}));
