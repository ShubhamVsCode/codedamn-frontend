"use client";
import { useSocket } from "@/hooks/socket";
import { SOCKET_URL } from "@/lib/axios";
import { useSandboxStore } from "@/store/sandbox";
import { useTabsStore } from "@/store/tabs";
import Editor from "@monaco-editor/react";
import { useRef } from "react";

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
  const { tabs, selectedTabId, updateContent } = useTabsStore();
  const socket = useSocket();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const tab = tabs.find((tab) => tab._id === selectedTabId);

  const handleUpdateChanges = (content?: string) => {
    if (content) updateContent(content);
    if (tab && content) saveChanges(content);
  };

  const saveChanges = async (fileContent: string) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (!fileContent) return;

      socket?.emit("updateContent", {
        fileName: tab?._id,
        fileContent: fileContent,
      });
      console.log("Update Content");

      timer.current = null;
    }, 1000);
  };

  return (
    <div className="w-full h-full">
      {tab?._id && (
        <Editor
          key={tab?._id}
          height="100%"
          defaultValue=""
          theme="vs-dark"
          language={extensionToLanguage[tab?.extension || "js"] || "javascript"}
          onChange={handleUpdateChanges}
          value={tab?.content ?? ""}
        />
      )}
    </div>
  );
};

export default CodeEditor;
