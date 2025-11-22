import { IUserInfo } from '@/types/user';
import { create } from 'zustand';

export interface IGlobalState {
  user?: IUserInfo;
  loading?: boolean;
}

export interface IGlobalAction {
  setState: (
    next: ((state: IGlobalState) => Partial<IGlobalState>) | Partial<IGlobalState>
  ) => void;
  modifyBadges: (
    next: (state: Partial<IUserInfo['badges']>) => Partial<IUserInfo['badges']>
  ) => void;
  reset: () => void;
}

export const initialState: IGlobalState = {};

export const useGlobalState = create<IGlobalState & IGlobalAction>((set, getState) => {
  return {
    ...initialState,
    setState: (next) => set(next),
    reset: () => set(initialState),
    modifyBadges: (next) => {
      const user = getState().user;
      if (!user) return;
      const badges = next(user.badges);
      console.log('🚀 ~ badges:', badges);
      set({
        user: {
          ...user,
          badges: {
            ...user.badges,
            ...badges,
          },
        },
      });
    },
  };
});
