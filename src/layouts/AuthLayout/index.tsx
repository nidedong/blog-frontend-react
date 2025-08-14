import { getToken } from '@/utils';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = getToken();

  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      message.warning(`${t('auth.login_information_invalid')}!`);
    }
  }, [token]);

  if (!token) return <Navigate replace to='/user/login' />;

  return <div>{children}</div>;
};

export default AuthLayout;
