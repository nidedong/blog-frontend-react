import { create } from 'zustand';

export interface IPresenceState {
  map: Record<string, boolean>;
}

export interface IPresenceAction {
  merge: (mmap: IPresenceState['map']) => void;
  reset: () => void;
  setOnline: (userId: string) => void;
  setOffline: (userId: string) => void;
}

export const initialState: IPresenceState = {
  map: {},
};

export const usePresenceState = create<IPresenceState & IPresenceAction>((set, getState) => {
  return {
    ...initialState,
    reset: () => set(initialState),
    merge: (mmap) =>
      set({
        map: {
          ...getState().map,
          ...mmap,
        },
      }),
    setOnline: (userId) => {
      set({
        map: {
          ...getState().map,
          [userId]: true,
        },
      });
    },
    setOffline: (userId) => {
      set({
        map: {
          ...getState().map,
          [userId]: false,
        },
      });
    },
  };
});
