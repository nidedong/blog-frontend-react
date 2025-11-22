import { ToasterProps, Toaster } from 'react-hot-toast';
import React from 'react';
import { useColorScheme, useTheme } from '@mui/material/styles';

const GlobalToaster: React.FC<ToasterProps> = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const palette = theme.vars?.palette || theme.palette;

  return (
    <Toaster
      key={mode}
      position='bottom-right'
      toastOptions={{
        style: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
        },
      }}
    />
  );
};

export default React.memo(GlobalToaster);
