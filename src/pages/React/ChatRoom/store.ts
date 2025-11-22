import { create } from 'zustand';

export interface IChatRoomState {}

export interface IGlobalAction {
  setState: (
    next: ((state: IChatRoomState) => Partial<IChatRoomState>) | Partial<IChatRoomState>
  ) => void;
  reset: () => void;
}

export const initialState: IChatRoomState = {};

export const useChatRoomState = create<IChatRoomState & IGlobalAction>((set, getState) => {
  return {
    ...initialState,
    setState: (next) => set(next),
    reset: () => set(initialState),
  };
});
