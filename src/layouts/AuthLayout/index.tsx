import { getToken, setToken } from '@/utils';
import Box from '@mui/material/Box';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = getToken();

  const urlParams = new URLSearchParams(location.search);

  const access_token = urlParams.get('access_token');

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

  return <Box sx={{ height: '100%' }}>{children}</Box>;
};

export default AuthLayout;
