"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

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

    term.write("Welcome to the terminal!\r\n");

    term.onKey((e) => {
      const { key, domEvent } = e;
      const printable =
        !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
      if (domEvent.key === "Enter") {
        term.write("\r\n");
      } else if (domEvent.key === "Backspace") {
        const cursorPosition = term.buffer.active.cursorX;
        if (cursorPosition > 2) {
          term.write("\b \b");
        }
      } else if (printable) {
        term.write(key);
      }
    });

    // const terminalData = term._core._inputHandler._parser._streams.writable;

    const handleTerminalData = (data: string) => {
      term.write(data);
    };

    // terminalData.on("data", handleTerminalData);

    return () => {
      //   terminalData.off("data", handleTerminalData);
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ width: "100%", height: "500px" }} />;
};

export default TerminalComponent;
