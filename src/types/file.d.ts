interface IFile {
  name: string;
  content: string;
  isDir: boolean;
  children?: IFile[];
}

type IFileStructure = IFile[];
