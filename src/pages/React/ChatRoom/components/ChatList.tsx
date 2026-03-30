import React, { useEffect } from 'react';
import List, { type ListProps } from '@mui/material/List';
import PrivateConversation from './PrivateConversation';
import GroupConversation from './GroupConversation';
import { Empty } from '@/components';
import { SocketEmitterEvents, useSocketEmitter } from '@/sockets';
import { Handler } from 'mitt';
import { ConversationType } from '../constants';
import { useChatRoomState } from '../store';
import useGetConvList from '../hooks/useGetConvList';
import useSortConvList from '../hooks/useSortConvList';
import { usePresenceState } from '@/stores/presence';
import { head } from 'lodash-es';
import { useParams } from 'react-router';
import { useUnmount } from 'ahooks';

const ChatList: React.FunctionComponent<ListProps> = (props) => {
  const activeConvId = useParams<{ id: string }>()?.id;
  const emitter = useSocketEmitter();
  const convList = useSortConvList();
  const convSummaryMap = useChatRoomState((state) => state.convSummaryMap);
  const onlineMap = usePresenceState((s) => s.map);
  const addConv = useChatRoomState((state) => state.addConv);
  const updateUnreadCount = useChatRoomState((s) => s.updateUnreadCount);
  const setActiveConvId = useChatRoomState((s) => s.setActiveConvId);
  const listQuery = useGetConvList();

  // 切换会话
  useEffect(() => {
    setActiveConvId(activeConvId);
  }, [activeConvId]);

  useUnmount(() => {
    setActiveConvId(undefined);
  });

  useEffect(() => {
    const handler: Handler<SocketEmitterEvents['notify:new_conversation']> = (newConversation) => {
      addConv({
        ...newConversation,
        messages: [],
      });
    };

    emitter.on('notify:new_conversation', handler);

    return () => {
      emitter.off('notify:new_conversation', handler);
    };
  }, []);

  useEffect(() => {
    const handler: Handler<SocketEmitterEvents['notify:conv_unread_updated']> = ({
      convId,
      unreadCount,
    }) => {
      if (activeConvId === convId) return;
      updateUnreadCount(convId, unreadCount);
    };
    emitter.on('notify:conv_unread_updated', handler);
    return () => {
      emitter.off('notify:conv_unread_updated', handler);
    };
  }, [activeConvId]);

  if (listQuery.isFetched && convList.length === 0) {
    return <Empty />;
  }

  return (
    <List dense disablePadding sx={{ gap: 0.5 }} {...props}>
      {convList.map((data) => {
        if (data.type === ConversationType.PRIVATE) {
          const toId = head(data.members)?.id;
          const isOnline = toId ? onlineMap[toId] : undefined;
          const selected = !!activeConvId && activeConvId === data?.id;
          return (
            <PrivateConversation
              key={data.id}
              data={data}
              unreadCount={convSummaryMap[data.id]?.unreadCount}
              isOnline={isOnline}
              selected={selected}
              lastMsg={convSummaryMap[data.id]?.lastMsg}
            />
          );
        }
        if (data.type === ConversationType.GROUP) {
          return <GroupConversation key={data.id} data={data} />;
        }
        return null;
      })}
    </List>
  );
};

export default React.memo(ChatList);
