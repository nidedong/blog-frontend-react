import { IUserInfo } from '@/types/user';
import { create } from 'zustand';

export interface IGlobalState {
  user?: IUserInfo;
  loading?: boolean
}

export interface IGlobalAction {
  setState: (
    next: ((state: IGlobalState) => Partial<IGlobalState>) | Partial<IGlobalState>
  ) => void;
  reset: () => void;
}

export const initialState: IGlobalState = {};

export const useGlobalState = create<IGlobalState & IGlobalAction>((set) => {
  return {
    ...initialState,
    setState: (next) => set(next),
    reset: () => set(initialState),
  };
});
