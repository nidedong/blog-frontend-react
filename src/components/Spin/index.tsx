import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SpinProps {
  spinning?: boolean;
  tip?: string;
  children?: React.ReactNode;
  size?: number;
}

const Spin: React.FC<SpinProps> = ({ spinning = false, tip, children, size = 40 }) => {
  return (
    <Box position='relative' display='inline-block' width='100%'>
      {children}

      {spinning && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(2px)',
          }}
        >
          <CircularProgress size={size} />
          {tip && (
            <Box mt={1} color='text.secondary' fontSize={14}>
              {tip}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Spin;
