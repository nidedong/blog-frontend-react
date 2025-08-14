import axios, { AxiosError, AxiosResponse } from 'axios';
import { getToken, logout, setToken } from './auth';
import { message as AntdMessage } from 'antd';
import type { IResType } from '@/types';
import i18n from '@/utils/i18n';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  timeout: +import.meta.env.VITE_API_TIMEOUT,
});

instance.interceptors.request.use(
  function (config) {
    const { useToken = true } = config;
    const token = getToken();
    if (useToken && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    const { config, data, headers } = response;
    const { flatData = true, origin = false, silent = false } = config;

    // 登录信息过期，从响应头设置新token
    console.log('🚀 ~ headers.refresh_token:', headers.refresh_token);
    if (headers.refresh_token) {
      setToken(headers.refresh_token);
    }

    const { success, message } = data as IResType;

    if (!silent && !success) {
      AntdMessage.error(message);
      return Promise.reject(message);
    }

    if (origin) {
      return response;
    }

    if (success && flatData) {
      return response.data.data;
    }

    return response.data;
  },
  function (error: AxiosError<IResType>) {
    if (error.status === 401) {
      AntdMessage.error(error.response?.data?.message ?? i18n.t('auth.login_information_invalid'));
      logout();
      return Promise.reject();
    }
    if (error.response?.data?.message) {
      AntdMessage.error(error.response.data.message);
      return Promise.reject();
    }

    AntdMessage.error(`${i18n.t('exception.server_error')}!`);
    return Promise.reject(error);
  }
);

export default instance;
