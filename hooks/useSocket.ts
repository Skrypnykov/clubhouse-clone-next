import React from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = React.useRef<Socket>();

  if (!socketRef.current) {
    socketRef.current = typeof window !== 'undefined' && io('http://localhost:3001');
  } else {
    socketRef.current.connect();
  }

  return socketRef.current;
};
