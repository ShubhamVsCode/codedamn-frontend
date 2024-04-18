"use client";
import { updateFile } from "@/actions";
import { useFilesStore } from "@/store/files";
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
  const { selectedTab, updateContent } = useTabsStore();
  const tab = selectedTab();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleUpdateChanges = (content?: string) => {
    if (content) updateContent(content);
    if (tab) saveChanges(tab);
  };

  const saveChanges = async (file: IFile) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (!file) return;

      timer.current = null;

      if (!file.isSaved) {
        const saved = await updateFile(
          file._id,
          file.name,
          file.content,
          file.extension,
        );
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full">
      <Editor
        key={tab?._id}
        height="100%"
        // defaultLanguage="javascript"
        defaultValue=""
        theme="vs-dark"
        language={
          extensionToLanguage[selectedTab()?.extension || "js"] || "javascript"
        }
        onChange={handleUpdateChanges}
        value={tab?.content ?? ""}
      />
    </div>
  );
};

export default CodeEditor;
