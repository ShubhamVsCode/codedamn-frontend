interface IFile {
  name: string;
  path: string;
  isDir: boolean;
  children?: IFile[];
}

// File that are fetched from the server
interface IActiveFile {
  path: string;
  content: string;
}

type IFileStructure = IFile[];
