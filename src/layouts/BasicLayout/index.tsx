import React from 'react';
import styles from './index.module.less';
import { Outlet } from 'react-router';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import GlobalLoading from '@/components/GlobalLoading';
import { useGlobalState } from '@/stores/global';

const BasicLayout: React.FC = () => {
  const isGlobalLoading = useGlobalState((state) => state.loading);

  if (isGlobalLoading) {
    return <GlobalLoading open />;
  }

  return (
    <Box className={styles.basicLayout} sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component='main'
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          mx: 3,
          display: 'flex !important',
          flexDirection: 'column',
          height: '100vh',
        })}
      >
        <Header />
        <Box sx={{ flex: 1, flexGrow: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicLayout;
