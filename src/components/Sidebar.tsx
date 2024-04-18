"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import cuid from "cuid";
import { createNewFile, getAllFiles, updateFile } from "@/actions";
import { useFilesStore } from "@/store/files";
import { useTabsStore } from "@/store/tabs";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  const { files, addFile, setFiles } = useFilesStore();
  const { tabs, openTab, selectedTabId } = useTabsStore();

  const [file, setFile] = useState<IFile | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const createFile = () => {
    if (!showInput) {
      setShowInput(true);
    }

    // FIXME: input was not focused until it is shown
    setTimeout(() => inputRef.current?.focus(), 0);

    const newFile: IFile = {
      _id: cuid(),
      name: "",
      content: "",
      extension: "",
      isSaved: false,
    };
    setFile(newFile);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!file) return;

    setFile({
      ...file,
      name: e.target.value,
      _id: file._id ?? cuid(),
      isSaved: false,
    });
  };

  const handleFileCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    // TODO: handle "." in file name if there is more than one
    const extension =
      file.name?.split(".").length > 1 ? file.name?.split(".")?.pop() : "";

    const newFile: IFile = {
      _id: file._id,
      name: file.name,
      content: "",
      extension: extension || "",
      isSaved: true,
    };

    const savedFileId = await createNewFile(file.name, "", extension || "");

    addFile({
      ...newFile,
      isSaved: Boolean(savedFileId),
      _id: savedFileId || newFile._id,
    });
    setFile(null);
    setShowInput(false);
  };

  useEffect(() => {
    const getFiles = async () => {
      const files = await getAllFiles();
      console.log(files);
      setFiles(files);
    };

    getFiles();
  }, [setFiles]);

  return (
    <div className="h-full w-full bg-gray-200 dark:bg-gray-900">
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <div
              className="cursor-pointer rounded-md p-2 hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => createFile()}
            >
              Add File
            </div>
            {files.map((file) => (
              <div
                key={file._id}
                className={cn(
                  "cursor-pointer rounded-md p-2 hover:bg-gray-300 dark:hover:bg-gray-700",
                  selectedTabId === file._id && "bg-gray-300 dark:bg-gray-700",
                )}
                onClick={() => openTab(file)}
              >
                {file.name}
              </div>
            ))}

            {showInput && (
              <form onSubmit={handleFileCreate}>
                <Input
                  ref={inputRef}
                  value={file?.name}
                  onChange={handleFileNameChange}
                  type="text"
                  placeholder="Enter file name"
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
