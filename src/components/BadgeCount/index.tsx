import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { isNil } from 'lodash-es';

export interface IBadgeCountProps extends BoxProps {
  count?: number;
}

const BadgeCount: React.FC<IBadgeCountProps> = ({ count, ...restProps }) => {
  if (isNil(count) || count === 0) return null;
  const internalCount = count > 99 ? '99+' : count;

  return (
    <Box
      component='span'
      {...restProps}
      sx={[
        (theme) => ({
          borderRadius: '50%',
          background: theme.vars?.palette.error.light,
          height: 14,
          minWidth: 14,
          lineHeight: '14px',
          textAlign: 'center',
          color: theme.vars?.palette.text.primary,
          fontWeight: 700,
          fontSize: 12,
          padding: '2px',
          boxSizing: 'content-box',
        }),
        ...(Array.isArray(restProps.sx) ? restProps.sx : [restProps.sx]),
      ]}
    >
      {internalCount}
    </Box>
  );
};

export default BadgeCount;
