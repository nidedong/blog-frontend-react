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
    url: '/auth/logout',
  });

export interface ISearchUserParams extends IReqPaginationParams {
  keyword?: string;
}

export type IUserItem = Omit<IUserInfo, 'badges'>;

export const searchUserListApi = (
  params: ISearchUserParams
): Promise<IResPaginationData<IUserItem>> =>
  request({
    url: '/user/search',
    method: 'get',
    params,
  });

export const searchNoRelationUserListApi = (
  params: ISearchUserParams
): Promise<IResPaginationData<IUserItem>> =>
  request({
    url: '/user/search/norelation',
    method: 'get',
    params,
  });
