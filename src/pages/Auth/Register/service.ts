import { request } from '@/utils';

export interface IRegisterAccountParams {
  email: string;
  password: string;
  captcha: string;
}

export const registerAccountApi = (data: IRegisterAccountParams): Promise<IResType> =>
  request({
    url: '/auth/register',
    method: 'post',
    data,
  });

export interface IGetChaptchaParams {
  email: string;
}

export const getCaptchaApi = (params: IGetChaptchaParams): Promise<IResType> =>
  request({
    url: '/captcha/register',
    method: 'get',
    params,
  });
