import { getUserProfileApi } from '@/services';
import { getToken } from '@/utils';
import { Socket } from 'socket.io-client';

// token 过期 调用获取个人信息接口刷新token，重新连接
export const reconnectWithNewToken = (socket: Socket | undefined) => {
  if (!socket) return;
  return getUserProfileApi().then(() => {
    socket.auth = {
      token: getToken(),
    };
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  });
};
