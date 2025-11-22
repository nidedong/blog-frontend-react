import useSocketManager from './hooks/useSocketManager';
import useChatSocket from './hooks/useChatSocket';
import useNotificationSocket from './hooks/useNotificationSocket';

export {
  SocketsManagerContext,
  SocketsManagerProvider,
  type ISocketsManagerContextValue,
} from './components/SocketsManagerContext';

export { SocketNameSpace, NotificationEvent, ChatEvent } from './constants';

export { useSocketManager, useChatSocket, useNotificationSocket };

export type {
  NotificationType,
  NotificationItem,
  INotificationState,
  INotificationAction,
} from './hooks/useNotificationStore';
export { useNotificationStore } from './hooks/useNotificationStore';
