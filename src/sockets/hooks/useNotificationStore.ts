import { create } from 'zustand';

export enum NotificationType {
  SYSTEM = 0,
  CUSTOM = 1,
  COMMENT = 4,
  LIKE = 3,
  WARNING = 2,
}

export interface NotificationItem {
  id?: string;

  userId?: string;

  isRead?: boolean;

  readAt?: Date;

  delivered?: boolean;

  title: string;

  content: string;

  type: NotificationType;

  metadata?: Record<string, any>;

  senderId?: string;

  broadcastId: string;
}

export interface INotificationState {
  list: NotificationItem[];
}

export interface INotificationAction {
  add: (notification: NotificationItem) => void;
  uniqAdd: (notification: NotificationItem) => void;
  setState: (
    next: ((state: INotificationState) => Partial<INotificationState>) | Partial<INotificationState>
  ) => void;
  reset: () => void;
}
const initialState: INotificationState = {
  list: [],
};

export const useNotificationStore = create<INotificationState & INotificationAction>(
  (set, getState) => {
    return {
      ...initialState,
      add: (notification) => set((pre) => ({ list: [notification, ...pre.list] })),
      uniqAdd: (notification) => {
        const list = getState().list;
        if (list.some((item) => item.broadcastId === notification.broadcastId)) return;
        set((pre) => ({ list: [notification, ...pre.list] }));
      },
      setState: (next) => set(next),
      reset: () => set(initialState),
    };
  }
);
