import { IMessageDto } from '@/pages/React/ChatRoom/service';
import { IConversationDetail } from '@/pages/React/ChatRoom/store';
import mitt from 'mitt';
import { NotificationItem } from './hooks/useNotificationStore';

export type SocketEmitterEvents = {
  'notify:new': NotificationItem;
  'notify:friend_request': { count: number };
  'notify:friend_status': { isOnline: boolean; userId: string };
  'notify:new_conversation': IConversationDetail;
  'notify:conv_unread_updated': {
    convId: string;
    unreadCount: number;
  };
  'chat:new_message': {
    message: IMessageDto;
  };
};

const emitter = mitt<SocketEmitterEvents>();

export default emitter;
