"use client";
import { useSocket } from "@/hooks/socket";
import { useFilesStore } from "@/store/files";
import { useTabsStore } from "@/store/tabs";
import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const extensionToLanguage: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
  py: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
};

const CodeEditor = () => {
  const { tabs, activeTab } = useTabsStore();
  const { activeFiles, addActiveFile, setActiveFiles } = useFilesStore();
  const [fileContent, setFileContent] = useState<string>("");
  const socket = useSocket();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tab = tabs.find((tab) => tab.path === activeTab);

  const handleUpdateChanges = (content?: string) => {
    if (content) {
      saveChanges(content);
    }
  };

  const saveChanges = async (fileContent: string) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (!fileContent) return;

      socket?.emit("updateContent", {
        filePath: tab?.path,
        fileContent: fileContent,
      });

      timer.current = null;
    }, 1000);
  };

  const getFileExtension = (path: string) => {
    return path.split(".").pop() || "";
  };

  useEffect(() => {
    if (tab?.path) {
      const file = activeFiles.find((file) => file.path === tab?.path);
      if (file) {
        setFileContent(file.content);
      } else {
        socket?.emit("getFile", { filePath: tab?.path });
      }
    }
  }, [activeTab, activeFiles, tab?.path, socket]);

  useEffect(() => {
    socket?.on("file", (data: { filePath: string; fileContent: string }) => {
      addActiveFile({ path: data.filePath, content: data.fileContent });
    });

    socket?.on(
      "fileContentUpdated",
      (data: { filePath: string; fileContent: string }) => {
        addActiveFile({ path: data.filePath, content: data.fileContent }, true);
      },
    );

    return () => {
      socket?.off("getFile");
    };
  }, [socket, addActiveFile]);

  return (
    <div className="w-full h-full">
      {tab?.path && (
        <Editor
          key={tab?.path}
          height="100%"
          defaultValue={fileContent}
          theme="vs-dark"
          language={
            extensionToLanguage[getFileExtension(tab.path)] || "javascript"
          }
          onChange={handleUpdateChanges}
          value={fileContent}
        />
      )}
    </div>
  );
};

export default CodeEditor;
