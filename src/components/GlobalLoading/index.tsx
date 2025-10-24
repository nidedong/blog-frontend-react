import React from 'react';
import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const GlobalLoading: React.FC<BackdropProps> = (props) => {
  return (
    <Backdrop {...props}>
      <CircularProgress />
    </Backdrop>
  );
};

export default GlobalLoading;
