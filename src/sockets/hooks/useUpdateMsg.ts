import { useCallback } from 'react';
import useChatSocket from './useChatSocket';
import { ChatEvent } from '../constants';

export interface IReadMsgPayload {
  conversationId: string;
  readSeq: number;
}

const useUpdateMsg = () => {
  const socket = useChatSocket();

  const readMsg = useCallback(
    (payload: IReadMsgPayload) => {
      return socket.emit(ChatEvent.CLIENT_MSG_READ, payload);
    },
    [socket]
  );

  return {
    readMsg,
  };
};

export default useUpdateMsg;
