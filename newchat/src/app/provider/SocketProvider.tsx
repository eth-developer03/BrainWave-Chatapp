"use client"
import React, { ReactNode,createContext, useMemo, useContext } from "react";
import { io, Socket } from "socket.io-client";

// Define the context type
interface SocketContextType {
  socket: Socket | null; 
}

// Create context with initial value
const SocketContext = createContext<SocketContextType>({ socket: null });

// Custom hook to use socket context
export const useSocket = (): Socket | null => {
  const { socket } = useContext(SocketContext);
  return socket;
};
interface SocketProviderProps {
    children: ReactNode;
  }

// SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children })=> {
  // Memoize the socket instance to prevent unnecessary re-creation
  const socket = useMemo(() => io("http://localhost:5000"), []);

  // Wrap children with SocketContext.Provider and provide the socket value
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
