import React, { createContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import useSocketManager from '../hooks/useSocketManager';
import { NotificationEvent, SocketNameSpace } from '../constants';
import { getToken, logout } from '@/utils';
import { WS_UNAUTHORIZED } from '@/constants';
import { reconnectWithNewToken } from '../utils';
import useSocketEmitter from '../hooks/useSocketEmitter';

export interface INotificationSocketContextValue {
  socket?: Socket;
}

const NotificationSocketContext = createContext<INotificationSocketContextValue>({});

const NotificationSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const manager = useSocketManager();
  const emitter = useSocketEmitter();
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

    socketRef.current.on('connect', () => {});

    // 连接过程的授权校验一次就好
    socketRef.current.on('connect_error', (error) => {
      if (error.message === WS_UNAUTHORIZED) {
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
    socketRef.current.on(NotificationEvent.BROADCAST, (payload: any) => {
      emitter.emit('notify:new', payload);
    });

    // 好友请求
    socketRef.current.on(NotificationEvent.FRIEND_REQUEST, (payload: any) => {
      emitter.emit('notify:friend_request', payload);
    });

    // 好友上线通知
    socketRef.current.on(NotificationEvent.FRIEND_STATUS, (payload: any) => {
      emitter.emit('notify:friend_status', payload);
    });

    // 会话未读数量改变
    socketRef.current.on(NotificationEvent.CONV_UNREAD_UPDATED, (payload: any) => {
      emitter.emit('notify:conv_unread_updated', payload);
    });

    /**
     * 新会话
     * 1.好友请求被同意
     */
    socketRef.current.on(NotificationEvent.NEW_PRIVATE_CONVERSATION, (payload: any) => {
      emitter.emit('notify:new_conversation', payload);
    });
  }, [manager]);

  return (
    <NotificationSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </NotificationSocketContext.Provider>
  );
};

export { NotificationSocketContext, NotificationSocketProvider };
