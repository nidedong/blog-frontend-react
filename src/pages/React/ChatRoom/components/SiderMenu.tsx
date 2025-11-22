import React from 'react';
import SearchBar from './SearchBar';
import { fixedRoutes } from '../routes';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { RouteObject, useMatches, useNavigate } from 'react-router';
import { RouteObjectHandle } from '@/types';
import path from 'path-browserify';
import { Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useTranslation } from 'react-i18next';
import ChatList from './ChatList';

const MenuRender: React.FC<{
  route: RouteObject;
  extra?: React.ReactNode;
  onClick?: ListItemProps['onClick'];
}> = ({ route, extra, onClick }) => {
  const handle: RouteObjectHandle = route.handle;
  const matches = useMatches();
  const basePath = '/react/chatroom';

  const selected =
    !!route.path &&
    matches.map((match) => match.pathname).includes(path.join(basePath, route.path));

  const navigate = useNavigate();

  if (handle.hideInMenu) return null;

  const handleClick: ListItemProps['onClick'] = (e) => {
    onClick?.(e);
    if (!route.path) return;
    navigate(path.join(basePath, route.path));
  };

  return (
    <ListItem onClick={handleClick} key={route.path} disablePadding sx={{ display: 'block' }}>
      <ListItemButton selected={selected}>
        {!!handle?.icon && <ListItemIcon>{handle.icon}</ListItemIcon>}
        <ListItemText
          disableTypography
          primary={handle?.name}
          style={{ fontSize: 16, fontWeight: 600 }}
        />
        {extra}
      </ListItemButton>
    </ListItem>
  );
};

const SiderMenu = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: 350,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: (theme) => `1px solid ${theme.vars?.palette.divider}`,
      }}
    >
      <SearchBar />

      <List dense sx={{ gap: 0.5 }}>
        {fixedRoutes.map((route) => (
          <MenuRender key={route.path} route={route} />
        ))}
      </List>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Typography fontWeight={600} sx={{ color: (theme) => theme.vars?.palette.text.secondary }}>
          {t('chat.title')}
        </Typography>
        <Tooltip title={t('chat.create_conversation')} placement='top' arrow>
          <ButtonBase>
            <AddIcon
              fontSize='small'
              sx={{ color: (theme) => theme.vars?.palette.text.secondary }}
            />
          </ButtonBase>
        </Tooltip>
      </Box>

      <Stack sx={{ flex: 1, overflowY: 'auto' }}>
        <ChatList />
      </Stack>
    </Box>
  );
};

export default SiderMenu;
