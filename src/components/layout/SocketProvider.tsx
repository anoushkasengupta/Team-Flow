import React, { createContext, useContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/useSocket';

// Context type
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export function useSocketContext() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const socket = useSocket();
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
} 