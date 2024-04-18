"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client";

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

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

    // term.write("Welcome to the terminal!\r\n");

    term.onKey((e) => {
      const { key, domEvent } = e;
      const printable =
        !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      socket.emit("command", key);

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

    socket.on("output", (data) => {
      handleTerminalData(data);
    });

    // terminalData.on("data", handleTerminalData);

    return () => {
      //   terminalData.off("data", handleTerminalData);
      term.dispose();
    };
  }, []);

  // useEffect(() => {
  //   const socket = io("http://localhost:4000");

  //   socket.on("command-output", (data) => {
  //     const { output } = data;
  //     terminalRef.current;
  //   });
  // }, []);

  return <div ref={terminalRef} style={{ width: "100%", height: "100%" }} />;
};

export default TerminalComponent;
