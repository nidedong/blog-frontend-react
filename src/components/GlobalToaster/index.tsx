import { ToasterProps, Toaster } from 'react-hot-toast';
import React from 'react';
import { useColorScheme, useTheme, type Palette } from '@mui/material/styles';

const GlobalToaster: React.FC<ToasterProps> = () => {
  const { mode } = useColorScheme();
  const theme = useTheme();

  const palette: Palette = (theme as any).colorSchemes?.[mode!]?.palette ?? theme.palette;

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
