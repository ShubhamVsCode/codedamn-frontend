import { useSandboxStore } from "@/store/sandbox";
import { useState } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const useSocket = (onConnection?: (socket: Socket) => void) => {
  const { sandboxUrl } = useSandboxStore();
  const [socket, setSocket] = useState<Socket | null>(() => {
    if (!socketInstance) {
      socketInstance = io(sandboxUrl, {
        autoConnect: false,
        query: { userId: localStorage.getItem("userId") || "" },
      });

      socketInstance.on("connect", () => {
        socketInstance && onConnection?.(socketInstance);
      });

      socketInstance.connect();
    }

    return socketInstance;
  });

  return socket;
};
