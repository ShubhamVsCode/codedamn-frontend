"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useSocket } from "@/hooks/socket";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  useEffect(() => {
    const term = new Terminal({
      convertEol: true,
      theme: {
        background: "#0c0c0c",
        foreground: "#ffffff",
      },
    });
    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);
    term.open(terminalRef.current!);

    fitAddon.fit();

    term.onData((data) => {
      socket?.emit("command", data);
    });

    socket?.on("output", (data) => {
      term.write(data);
    });

    return () => {
      term.dispose();
    };
  }, [socket]);

  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
};

export default TerminalComponent;
