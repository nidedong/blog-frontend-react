import { request } from '@/utils';

export interface ILoginByEmailParams {
  email: string;
  password: string;
}

export const loginByEmailApi = (
  data: ILoginByEmailParams
): Promise<{
  accessToken: string;
}> =>
  request({
    url: '/auth/login/email',
    method: 'post',
    data,
  });

export interface ILoginByCaptchaParams {
  email: string;
  captcha: string;
}

export const loginByCaptchaApi = (
  data: ILoginByCaptchaParams
): Promise<{
  accessToken: string;
}> =>
  request({
    url: '/auth/login/captcha',
    method: 'post',
    data,
  });

export interface IGetChaptchaParams {
  email: string;
}

export const getCaptchaApi = (params: IGetChaptchaParams) =>
  request({
    url: '/captcha/login',
    method: 'get',
    params,
  });
