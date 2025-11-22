import { useContext } from 'react';
import { NotificationSocketContext } from '../components/NotificationSocketContext';

const useNotificationSocket = () => {
  return useContext(NotificationSocketContext).socket!;
};

export default useNotificationSocket;
