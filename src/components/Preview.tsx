"use client";

import { useSandboxStore } from "@/store/sandbox";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Preview = () => {
  const [previewUrl, setPreviewUrl] = useState("");
  const { sandboxUrl } = useSandboxStore();

  const handleOpenPreview = () => {
    const runningAppPort = 3000;
    const subdomain = sandboxUrl.split(".")[0];
    const domain = `.shubhamvscode.online`;
    const appUrl = `${subdomain}-${runningAppPort}${domain}`;

    setPreviewUrl(appUrl);
  };

  //   const handleRefresh = () => {
  //     setPreviewUrl("");
  //     handleOpenPreview();
  //   };

  return (
    <div className="flex flex-col text-white">
      <div className="flex items-center justify-end px-4 py-2">
        <Button onClick={handleOpenPreview}>Open Preview</Button>
      </div>
      <Input
        type="text"
        value={previewUrl}
        onChange={(e) => setPreviewUrl(e.target.value)}
      />

      <iframe
        src={previewUrl}
        title="Preview"
        width="100%"
        height="900px"
        className="bg-white"
      />
    </div>
  );
};

export default Preview;
