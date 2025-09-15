import { ACCESS_TOKEN_KEY, getToken, setToken } from '@/utils';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import Cookie from 'js-cookie';

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = getToken();

  const access_token = Cookie.get(ACCESS_TOKEN_KEY);

  const { t } = useTranslation();

  useEffect(() => {
    if (access_token) {
      setToken(access_token);
      return;
    }

    if (!token) {
      message.warning(`${t('auth.login_information_invalid')}!`);
    }
  }, [token, access_token]);

  if (!token && !access_token) return <Navigate replace to='/user/login' />;

  return <div>{children}</div>;
};

export default AuthLayout;
