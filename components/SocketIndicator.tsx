"use client";

import { ArrowDownUp } from "lucide-react";
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  return (
    <ArrowDownUp
      className={`${
        isConnected ? "text-green-600" : "text-yellow-600"
      } border-none`}
    />
  );
};
