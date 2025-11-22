import { useContext } from 'react';
import { ChatSocketContext } from '../components/ChatSocketContext';

const useChatSocket = () => {
  return useContext(ChatSocketContext).socket!;
};

export default useChatSocket;
