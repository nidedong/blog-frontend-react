import { IUserInfo } from '@/types';
import { request } from '@/utils';

export interface IGetChaptchaParams {
  email: string;
}

export const getCaptchaApi = (params: IGetChaptchaParams): Promise<IResType> =>
  request({
    url: '/captcha/changepassword',
    method: 'get',
    params,
  });

export interface IChangePasswordParams {
  captcha: string;
  password: string;
}

export const changePasswordApi = (data: IChangePasswordParams): Promise<IResType> =>
  request({
    url: '/user/changepassword',
    method: 'put',
    data,
  });

export const updateProfileApi = (data: Partial<IUserInfo>): Promise<IResType> =>
  request({
    url: '/user/profile',
    method: 'put',
    data,
  });
