import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { isNil } from 'lodash-es';
import React from 'react';
import { useTranslation } from 'react-i18next';

const UserStatus: React.FC<
  React.PropsWithChildren<{
    isOnline?: boolean;
  }>
> = ({ children, isOnline }) => {
  const { t } = useTranslation();

  if (isNil(isOnline)) return children;

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Tooltip title={isOnline ? t('user.online') : t('user.offline')}>
        <Box
          sx={(theme) => {
            return {
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: isOnline
                ? theme.vars?.palette.success.main
                : theme.vars?.palette.error.main,
            };
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default UserStatus;
