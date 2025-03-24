import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../constants/api';

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(API_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('🟢 Socket connecté');
    });

    newSocket.on('disconnect', () => {
      console.log('🔴 Socket déconnecté');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
