import React, { createContext, useEffect, useRef } from 'react';
import { Manager } from 'socket.io-client';
import { NotificationSocketProvider } from './NotificationSocketContext';
import { ChatSocketProvider } from './ChatSocketContext';
import { useProfile } from '@/hooks';

export interface ISocketsManagerContextValue {
  manager?: Manager;
}

const url = import.meta.env.VITE_WEBSOCKET_URL;

const SocketsManagerContext = createContext<ISocketsManagerContextValue>({});

const SocketsManagerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const managerRef = useRef<Manager>();

  if (!managerRef.current) {
    managerRef.current = new Manager(url, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }

  const profileQuery = useProfile();

  useEffect(() => {
    if (!managerRef.current) return;
    // todo token过期处理
    // socket重连时
    managerRef.current.on('reconnect', () => {
      // 重新请求个人信息，同步badges
      profileQuery.refetch();
    });

    return () => {
      managerRef.current?.removeAllListeners();
      managerRef.current?._close();
    };
  }, []);

  return (
    <SocketsManagerContext.Provider value={{ manager: managerRef.current }}>
      <NotificationSocketProvider>
        <ChatSocketProvider>{children} </ChatSocketProvider>
      </NotificationSocketProvider>
    </SocketsManagerContext.Provider>
  );
};

export { SocketsManagerContext, SocketsManagerProvider };
