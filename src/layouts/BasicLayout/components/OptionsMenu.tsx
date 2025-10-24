import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';
import { useMutation, useQueryClient } from 'react-query';
import { logoutApi } from '@/services';
import { setToken, toLogin } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logoutMutate = useMutation(logoutApi, {
    onSuccess() {
      setToken(undefined);
      toLogin();
      setTimeout(() => {
        queryClient.clear();
      }, 100);
    },
  });

  const handleLogout = () => {
    logoutMutate.mutate();
  };

  const handleGoProfile = () => {
    navigate('/profile');
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <MenuButton aria-label='Open menu' onClick={handleClick} sx={{ borderColor: 'transparent' }}>
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id='menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        <MenuItem onClick={handleGoProfile}>{t('user.profile')}</MenuItem>
        <MenuItem onClick={handleClose} disabled>
          {t('user.setting')}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
          <ListItemText>{t('user.logout')}</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize='small' />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
