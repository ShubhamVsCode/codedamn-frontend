import { useSandboxStore } from "@/store/sandbox";
import { useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const useSocket = (onConnection?: (socket: Socket) => void) => {
  const { sandboxUrl } = useSandboxStore();
  const { userId } = useUserStore();
  const [socket, setSocket] = useState<Socket | null>();

  useEffect(() => {
    if (!socket) {
      const connectToSandbox = () => {
        if (!socketInstance && sandboxUrl) {
          socketInstance = io(sandboxUrl, {
            transports: ["websocket"],
            autoConnect: false,
            query: { userId: userId || "" },
            perMessageDeflate: {
              threshold: 0,
            },
          });

          socketInstance.on("connect", () => {
            onConnection?.(socketInstance!);
          });

          socketInstance.connect();
        }

        return socketInstance;
      };
      setSocket(connectToSandbox());
    }
  }, [socket, onConnection, sandboxUrl, userId]);

  return socket;
};
