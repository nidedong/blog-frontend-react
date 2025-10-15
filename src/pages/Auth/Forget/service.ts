import { IResType } from '@/types';
import { request } from '@/utils';

export interface IForgetPasswordParams {
  email: string;
  password: string;
  captcha: string;
}

export const forgetPasswordApi = (data: IForgetPasswordParams): Promise<IResType> =>
  request({
    url: '/user/forgetpassword',
    method: 'put',
    data,
  });

export interface IGetChaptchaParams {
  email: string;
}

export const getCaptchaApi = (params: IGetChaptchaParams): Promise<IResType> =>
  request({
    url: '/captcha/forgetpassword',
    method: 'get',
    params,
  });
