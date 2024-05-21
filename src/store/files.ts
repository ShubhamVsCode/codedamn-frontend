import { create } from "zustand";

interface FilesState {
  files: IFileStructure;
  setFiles: (files: IFileStructure) => void;
  activeFiles: IActiveFile[];
  setActiveFiles: (activeFiles: IActiveFile[]) => void;
  addActiveFile: (file: IActiveFile, replace?: boolean) => void;
  updateFile: (file: IActiveFile) => void;
}

export const useFilesStore = create<FilesState>()((set) => ({
  files: [],
  setFiles: (files: IFileStructure) => set(() => ({ files })),
  activeFiles: [],
  setActiveFiles: (activeFiles: IActiveFile[]) => set(() => ({ activeFiles })),
  addActiveFile: (file: IActiveFile, replace: boolean = false) =>
    set((state) => {
      if (state.activeFiles.find((f) => f.path === file.path) && replace) {
        return {
          activeFiles: state.activeFiles.map((f) =>
            f.path === file.path ? file : f,
          ),
        };
      }
      return { activeFiles: [...state.activeFiles, file] };
    }),
  updateFile: (file: IActiveFile) =>
    set((state) => ({
      activeFiles: state.activeFiles.map((f) =>
        f.path === file.path ? file : f,
      ),
    })),
}));

export const getFile = (path: string): IFile | null => {
  const files = useFilesStore.getState().files;
  const pathSegments = path.split("/").filter(Boolean);

  let currentFiles = files;
  let foundFile: IFile | null = null;

  for (const segment of pathSegments) {
    foundFile = currentFiles.find((file) => file.name === segment) || null;
    if (!foundFile) {
      return null;
    }
    currentFiles = foundFile.children || [];
  }

  return foundFile;
};
