import React, { createContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import useSocketManager from '../hooks/useSocketManager';
import { NotificationEvent, SocketNameSpace } from '../constants';
import { NotificationItem, useNotificationStore } from '../hooks/useNotificationStore';
import { useGlobalState } from '@/stores/global';
import { sum } from 'lodash-es';
import { getToken, logout } from '@/utils';
import { WS_UNAUTHORIZED } from '@/constants';
import { reconnectWithNewToken } from '../utils';

export interface INotificationSocketContextValue {
  socket?: Socket;
}

const NotificationSocketContext = createContext<INotificationSocketContextValue>({});

const NotificationSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const manager = useSocketManager();
  const socketRef = useRef<Socket>();

  if (!socketRef.current) {
    socketRef.current = manager.socket(SocketNameSpace.NOTIFICATION, {
      auth: {
        token: getToken(),
      },
    });
    socketRef.current.connect();
  }

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('connect', () => {
      console.log('🚀 ~ notification socket: 重连中...');
    });

    // 连接过程的授权校验一次就好
    socketRef.current.on('connect_error', (error) => {
      if (error.message === WS_UNAUTHORIZED) {
        console.log('🚀 ~ socket ~ error.message:', error.message);
        const token = getToken();
        // 没token
        if (!token) {
          logout();
        } else {
          reconnectWithNewToken(socketRef.current);
        }
      }
    });

    socketRef.current.on('token_expired', () => {
      reconnectWithNewToken(socketRef.current);
    });
  }, [manager]);

  useEffect(() => {
    if (!socketRef.current) return;

    // 新通知
    socketRef.current.on(NotificationEvent.BROADCAST, (message: NotificationItem, ...rest) => {
      console.log('🚀 ~ notification socket: broadcaseListener...', message, rest);
      useNotificationStore.getState().uniqAdd(message);
      useGlobalState
        .getState()
        .modifyBadges((badges) => ({ notification: sum([badges.notification, 1]) }));
    });

    // 好友请求
    socketRef.current.on(NotificationEvent.FRIEND_REQUEST, (message: { count: number }) => {
      useGlobalState.getState().modifyBadges(() => ({ friendreq: message.count }));
    });
  }, [manager]);

  return (
    <NotificationSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </NotificationSocketContext.Provider>
  );
};

export { NotificationSocketContext, NotificationSocketProvider };
