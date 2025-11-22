import { NotificationItem } from '@/sockets';
import { request } from '@/utils';

export interface IGetNotifiyListParams {
  isRead?: boolean;
}

export const getNotifiyListApi = (params: IGetNotifiyListParams): Promise<NotificationItem[]> =>
  request({
    url: '/notification/list',
    method: 'get',
    params,
  });

export interface IReadNotificationParams {
  broadcastId: string;
  notifyId?: string;
}

export const readNotificationApi = (data: IReadNotificationParams): Promise<IResType> =>
  request({
    url: '/notification/read',
    method: 'put',
    data,
  });
