import React, { useEffect, useRef, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "@/lib/utils";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { useSocket } from "@/hooks/socket";
import { FileIcon, FolderIcon, FolderPlusIcon } from "lucide-react";
import { useTabsStore } from "@/store/tabs";

const FileStructure = ({
  fileStructure,
  currentPath = "",
}: {
  fileStructure: IFileStructure;
  currentPath?: string;
}) => {
  const [showInput, setShowInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDir, setIsDir] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const { addTab, setActiveTab } = useTabsStore();

  const handleAddFile = () => {
    if (fileName) {
      socket?.emit("addFile", {
        filePath: `${currentPath}/${fileName}`,
        isDir,
      });
      setFileName("");
      setShowInput(false);
    } else {
      setShowInput(false);
    }
  };

  const handleOpenFile = (path: string, name: string) => {
    addTab({ path, name });
    setActiveTab(path);
  };

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div className="space-y-0.5 pl-2">
      {currentPath === "" && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowInput(true);
              setIsDir(false);
            }}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-800"
          >
            <FilePlusIcon className="w-5 h-5 text-gray-200" />
            <span className="font-medium">Add File</span>
          </button>
          <button
            onClick={() => {
              setShowInput(true);
              setIsDir(true);
            }}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-800"
          >
            <FolderPlusIcon className="w-5 h-5 text-gray-200" />
            <span className="font-medium">Add Folder</span>
          </button>
        </div>
      )}

      {fileStructure
        .sort((a, b) =>
          a.isDir === b.isDir
            ? a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            : a.isDir
            ? -1
            : 1,
        )
        .map((item) => {
          return item.isDir ? (
            <Folder key={item.name} item={item} parentPath={currentPath} />
          ) : (
            <button
              key={item.name}
              className="flex items-center gap-2 hover:bg-gray-800 p-1 w-full rounded-md"
              onClick={() =>
                handleOpenFile(`${currentPath}/${item.name}`, item.name)
              }
            >
              <FileIcon className="w-5 h-5 text-purple-500" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      {showInput && (
        <Input
          ref={inputRef}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddFile();
            }
          }}
          onBlur={() => setShowInput(false)}
        />
      )}
    </div>
  );
};

const Folder = ({ item, parentPath }: { item: IFile; parentPath: string }) => {
  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDir, setIsDir] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleAddFile = () => {
    if (fileName) {
      socket?.emit("addFile", {
        filePath: `${parentPath}/${item.name}/${fileName}`,
        isDir: isDir,
      });
      setFileName("");
      setShowInput(false);
    } else {
      setShowInput(false);
    }
  };

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("space-y-2")}>
      <CollapsibleTrigger className="flex h-8 group items-center gap-2 hover:bg-gray-800 p-1 w-full rounded-md">
        <FolderIcon className="w-5 h-5 text-yellow-500" />
        <span className="font-medium">{item.name}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowInput(true);
            setOpen(true);
          }}
          className="hidden group-hover:block p-1 rounded-md"
        >
          <FilePlusIcon className="w-5 h-5 text-gray-200" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowInput(true);
            setIsDir(true);
          }}
          className="hidden group-hover:block p-1 rounded-md"
        >
          <FolderPlusIcon className="w-5 h-5 text-gray-200" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-2 pl-1 space-y-2 border-l-2 border-gray-600">
        {showInput && (
          <Input
            ref={inputRef}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddFile();
              }
            }}
            onBlur={() => setShowInput(false)}
          />
        )}
        <FileStructure
          fileStructure={item.children || []}
          currentPath={`${parentPath}/${item.name}`}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FileStructure;
