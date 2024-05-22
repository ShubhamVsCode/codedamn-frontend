"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useFilesStore } from "@/store/files";
import { useTabsStore } from "@/store/tabs";
import { useSandboxStore } from "@/store/sandbox";
import { useUserStore } from "@/store/user";
import { useSocket } from "@/hooks/socket";

import { ScrollArea } from "./ui/scroll-area";
import FileStructure from "./FileStructure";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { files, setFiles } = useFilesStore();
  const { setSandboxUrl } = useSandboxStore();
  const { setUserId } = useUserStore();

  const [file, setFile] = useState<IFile | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const socket = useSocket();

  const router = useRouter();

  const createFile = () => {
    if (!showInput) {
      setShowInput(true);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!file) return;

    setFile({
      ...file,
      name: e.target.value,
      // _id: file._id ?? cuid(),
    });
  };

  const handleFileCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;

    socket?.emit("newFile", file.name);

    // TODO: handle "." in file name if there is more than one
    // const extension =
    //   file.name?.split(".").length > 1 ? file.name?.split(".")?.pop() : "";

    // const newFile: IFile = {
    //   _id: file._id,
    //   name: file.name,
    //   content: "",
    //   extension: extension || "",
    //   isSaved: true,
    // };

    // const savedFileId = await createNewFile(file.name, "", extension || "");

    // addFile({
    //   ...newFile,
    //   isSaved: Boolean(savedFileId),
    //   _id: savedFileId || newFile._id,
    // });
    // setFile(null);
    // setShowInput(false);
  };

  // useEffect(() => {
  //   socket?.on("newFileCreated", (file: string) => {
  //     // addFile({ _id: file, name: file, content: "", extension: "js" });
  //     setFile(null);
  //     setShowInput(false);
  //   });

  //   socket?.on("allFiles", (filesName: string[]) => {
  //     const files = filesName.map((name) => ({
  //       _id: name,
  //       name,
  //       content: "",
  //       extension: "js",
  //     }));

  //     // setFiles(files);
  //   });

  //   return () => {
  //     socket?.off("newFileCreated");
  //     socket?.off("allFiles");
  //   };
  // }, [setFiles, socket]);

  const handleFileClick = (fileId: string) => {
    socket?.emit("getFileContent", fileId);
  };

  useEffect(() => {
    socket?.on(
      "fileContent",
      ({
        fileName,
        fileContent,
      }: {
        fileName: string;
        fileContent: string;
      }) => {
        // updateFile({
        //   _id: fileName,
        //   name: fileName,
        //   content: fileContent,
        //   extension: "js",
        // });
        // openTab({
        //   name: fileName,
        //   content: fileContent,
        // });
      },
    );
  }, [socket]);

  useEffect(() => {
    const fetchFileStructure = () => {
      socket?.emit("getFileStructure");
    };
    socket?.on("fileStructure", (fileStructure: IFile[]) =>
      setFiles(fileStructure),
    );
    socket?.on("newFileCreated", fetchFileStructure);
    socket?.on("fileChanged", fetchFileStructure);

    setTimeout(fetchFileStructure, 1000);

    return () => {
      socket?.off("fileStructure");
      socket?.off("newFileCreated");
      socket?.off("fileChanged");
    };
  }, [socket, setFiles]);

  useEffect(() => {
    const sandboxUrl = localStorage.getItem("sandboxUrl");
    const userId = localStorage.getItem("userId");
    if (sandboxUrl) {
      setSandboxUrl(sandboxUrl);
      setUserId(userId ?? "");
    } else {
      // router.push("/");
    }
  }, [setSandboxUrl, setUserId, router]);

  return (
    <div className="h-full w-full bg-gray-200 dark:bg-zinc-900">
      <ScrollArea className="h-full">
        <FileStructure fileStructure={files} currentPath="" />
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
