import { useContext } from 'react';
import { SocketsManagerContext } from '../components/SocketsManagerContext';

const useSocketEmitter = () => {
  return useContext(SocketsManagerContext).emitter;
};

export default useSocketEmitter;
