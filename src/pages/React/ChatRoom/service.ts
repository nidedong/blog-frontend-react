import { IUserInfo } from '@/types';
import { request } from '@/utils';
import { FriendReqStatus, FriendStatus } from './constants';
import { IUserItem } from '@/services';

export interface IFriendItem extends IUserItem {
  status: FriendStatus;
}

export const getFriendListApi = (): Promise<IFriendItem[]> =>
  request({
    url: '/friend',
    method: 'get',
  });

export interface IGetFriendReqListParams {
  status: FriendReqStatus;
}

export interface IFriendReqItemAction {
  isAgreeing?: boolean;
  isRejecting?: boolean;
}

export interface IFriendReqItem extends IFriendReqItemAction {
  status: FriendReqStatus;
  senderId: string;
  receiverId: string;
  message?: string;
  receiver: IUserInfo;
  sender: IUserInfo;
  id: string;
}

export const getFriendReqListApi = (params: IGetFriendReqListParams): Promise<IFriendReqItem[]> =>
  request({
    url: '/friend/request',
    method: 'get',
    params,
  });

export const sendFriendReqApi = (params: {
  receiverId: string;
  message?: string;
}): Promise<IFriendReqItem[]> =>
  request({
    url: '/friend/request',
    method: 'post',
    data: params,
  });

export const handleFriendReqApi = (params: {
  id: string;
  status: FriendReqStatus;
}): Promise<IFriendReqItem[]> =>
  request({
    url: `/friend/request/${params.id}/handle`,
    method: 'put',
    data: params,
  });
