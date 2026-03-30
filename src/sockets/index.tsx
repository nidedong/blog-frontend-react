import useSocketManager from './hooks/useSocketManager';
import useChatSocket from './hooks/useChatSocket';
import useNotificationSocket from './hooks/useNotificationSocket';
import useSocketEmitter from './hooks/useSocketEmitter';
import useUpdateMsg from './hooks/useUpdateMsg';
import emitter, { SocketEmitterEvents } from './emitter';

export { emitter, useSocketEmitter, type SocketEmitterEvents };

export {
  SocketsManagerContext,
  SocketsManagerProvider,
  type ISocketsManagerContextValue,
} from './components/SocketsManagerContext';

export { SocketNameSpace, NotificationEvent, ChatEvent } from './constants';

export { useSocketManager, useChatSocket, useNotificationSocket, useUpdateMsg };

export type {
  NotificationType,
  NotificationItem,
  INotificationState,
  INotificationAction,
} from './hooks/useNotificationStore';
export { useNotificationStore } from './hooks/useNotificationStore';
