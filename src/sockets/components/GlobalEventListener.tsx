/**
 * 全局状态相关的事件监听
 * 主要是@/stores/*下的全局状态
 */

import React, { useEffect } from 'react';
import useSocketEmitter from '../hooks/useSocketEmitter';
import { useNotificationStore } from '../hooks/useNotificationStore';
import { useGlobalState } from '@/stores/global';
import { Handler } from 'mitt';
import { SocketEmitterEvents } from '../emitter';
import { usePresenceState } from '@/stores/presence';

const NotificationEventListener: React.FC<React.PropsWithChildren> = ({ children }) => {
  const emitter = useSocketEmitter();

  useEffect(() => {
    const handler: Handler<SocketEmitterEvents['notify:new']> = (payload) => {
      useNotificationStore.getState().uniqAdd(payload);
      // todo 可优化
      useGlobalState.getState().setNotificationUnread((pre) => pre + 1);
    };

    emitter.on('notify:new', handler);

    return () => {
      emitter.off('notify:new', handler);
    };
  }, []);

  useEffect(() => {
    const handler: Handler<SocketEmitterEvents['notify:friend_request']> = (payload) => {
      useGlobalState.getState().setFriendreqUnread(payload.count);
    };

    emitter.on('notify:friend_request', handler);
    return () => {
      emitter.off('notify:friend_request', handler);
    };
  }, []);

  useEffect(() => {
    const handler: Handler<SocketEmitterEvents['notify:friend_status']> = (payload) => {
      if (!payload.userId) return;
      const setOnline = usePresenceState.getState().setOnline;
      const setOffline = usePresenceState.getState().setOffline;
      if (payload.isOnline) {
        setOnline(payload.userId);
      } else {
        setOffline(payload.userId);
      }
    };

    emitter.on('notify:friend_status', handler);
    return () => {
      emitter.off('notify:friend_status', handler);
    };
  }, []);

  return <>{children}</>;
};

const ChatEventListener: React.FC<React.PropsWithChildren> = ({ children }) => {
  const emitter = useSocketEmitter();

  useEffect(() => {
    const handler: Handler<SocketEmitterEvents['notify:conv_unread_updated']> = ({
      unreadCount,
    }) => {
      useGlobalState
        .getState()
        .setMessageUnread((pre) => pre + unreadCount - useGlobalState.getState().messageUnread);
    };
    emitter.on('notify:conv_unread_updated', handler);
    return () => {
      emitter.off('notify:conv_unread_updated', handler);
    };
  }, []);

  return <>{children}</>;
};

const GlobalEventListener: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <NotificationEventListener>
      <ChatEventListener>{children}</ChatEventListener>
    </NotificationEventListener>
  );
};

export default GlobalEventListener;
