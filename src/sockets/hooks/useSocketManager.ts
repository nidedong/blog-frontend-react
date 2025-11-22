import { useContext } from 'react';
import { SocketsManagerContext } from '../components/SocketsManagerContext';

const useSocketManager = () => {
  return useContext(SocketsManagerContext).manager!;
};

export default useSocketManager;
