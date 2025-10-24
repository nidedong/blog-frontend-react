import { SwitchLanguage } from '@/components';
import ColorModeIconDropdown from '@/themes/ColorModeIconDropdown';
import Stack, { type StackProps } from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import React from 'react';

const StyledContainer = styled(Stack)(({ theme }) => {
  return {
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
      backgroundRepeat: 'no-repeat',
      ...theme.applyStyles('dark', {
        backgroundImage:
          'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
      }),
    },
  };
});

const Container: React.FC<React.PropsWithChildren<StackProps>> = (props) => {
  return (
    <StyledContainer {...props}>
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          columnGap: theme.spacing(1),
        })}
      >
        <ColorModeIconDropdown />
        <SwitchLanguage />
      </Box>
      {props.children}
    </StyledContainer>
  );
};

export default Container;
