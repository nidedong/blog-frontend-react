import { IUserInfo } from '@/types/user';
import { isFunction } from 'lodash-es';
import { create } from 'zustand';

export interface IGlobalState {
  user?: IUserInfo;
  loading?: boolean;
  notificationUnread: number;
  messageUnread: number;
  friendreqUnread: number;
}

export interface IGlobalAction {
  setState: (
    next: ((state: IGlobalState) => Partial<IGlobalState>) | Partial<IGlobalState>
  ) => void;
  reset: () => void;
  initState: (user: IUserInfo) => void;
  setNotificationUnread: (count: number | ((count: number) => number)) => void;
  setMessageUnread: (count: number | ((count: number) => number)) => void;
  setFriendreqUnread: (count: number | ((count: number) => number)) => void;
}

export const initialState: IGlobalState = {
  notificationUnread: 0,
  messageUnread: 0,
  friendreqUnread: 0,
};

export const useGlobalState = create<IGlobalState & IGlobalAction>((set, getState) => {
  return {
    ...initialState,
    setState: (next) => set(next),
    reset: () => set(initialState),
    initState: (user: IUserInfo) => {
      set({
        user,
        notificationUnread: user.badges.notification,
        messageUnread: user.badges.message,
        friendreqUnread: user.badges.friendreq,
      });
    },
    setNotificationUnread(count) {
      set({
        notificationUnread: isFunction(count) ? count(getState().notificationUnread) : count,
      });
    },
    setMessageUnread(count) {
      set({
        messageUnread: isFunction(count) ? count(getState().messageUnread) : count,
      });
    },
    setFriendreqUnread(count) {
      set({
        friendreqUnread: isFunction(count) ? count(getState().friendreqUnread) : count,
      });
    },
  };
});
