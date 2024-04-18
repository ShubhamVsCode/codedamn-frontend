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
  removeFile: (_id: string) =>
    set((state) => ({ files: state.files.filter((file) => file._id !== _id) })),
  setFiles: (files: IFile[]) => set((state) => ({ files })),
}));
