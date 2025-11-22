import React, { createContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import useSocketManager from '../hooks/useSocketManager';
import { SocketNameSpace } from '../constants';
import { getToken } from '@/utils';
import { reconnectWithNewToken } from '../utils';

export interface IChatSocketContextValue {
  socket?: Socket;
}

const ChatSocketContext = createContext<IChatSocketContextValue>({});

const ChatSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const manager = useSocketManager();
  const socketRef = useRef<Socket>();

  if (!socketRef.current) {
    socketRef.current = manager.socket(SocketNameSpace.CHAT, {
      auth: {
        token: getToken(),
      },
    });
    socketRef.current.connect();
  }

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('reconnect', () => {
      console.log('🚀 ~ notification chat: 重连中...');
    });

    socketRef.current.on('token_expired', () => {
      reconnectWithNewToken(socketRef.current);
    });
  }, [manager]);

  return (
    <ChatSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export { ChatSocketContext, ChatSocketProvider };
