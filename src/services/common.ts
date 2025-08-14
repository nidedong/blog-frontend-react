import { IUserInfo } from '@/types';
import { request } from '@/utils';

export interface IUserRelationBaseParam {
  id: string;
}

export const getUserProfileApi = (): Promise<IUserInfo> =>
  request({
    method: 'get',
    url: '/user/profile',
  });

export const logoutApi = () =>
  request({
    method: 'put',
    url: '/user/logout',
  });
