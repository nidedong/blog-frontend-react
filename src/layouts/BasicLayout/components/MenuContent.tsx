import List from '@mui/material/List';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { useMemo } from 'react';
import { routes } from '@/routes';
import { RouteObject, useMatches, useNavigate } from 'react-router';
import { get } from 'lodash-es';
import { useState } from 'react';
import { RouteObjectHandle } from '@/types';

const renderMenuList = (routes: RouteObject[] | undefined) => {
  if (!routes) return null;
  return (
    <>
      {routes.map((route) => {
        const effectiveChildren = route.children?.filter(
          (child) => !!child.path && !child.handle?.hideInMenu
        );

        if (!effectiveChildren || effectiveChildren.length === 0) {
          if (!route.path) {
            return null;
          } else {
            return <MenuRender route={route} />;
          }
        }
        return <CollapseMenuRender route={route} />;
      })}
    </>
  );
};

const MenuRender: React.FC<{
  route: RouteObject;
  isLink?: boolean;
  extra?: React.ReactNode;
  onClick?: ListItemProps['onClick'];
}> = ({ route, extra, isLink = true, onClick }) => {
  const handle: RouteObjectHandle = route.handle;
  const matches = useMatches();
  const selected =
    !!route.handle?.to && matches.map((match) => match.pathname).includes(route.handle.to);
  const navigate = useNavigate();

  if (handle.hideInMenu) return null;

  const handleClick: ListItemProps['onClick'] = (e) => {
    onClick?.(e);
    if (!isLink || !route.handle?.to) return;
    navigate(route.handle.to);
  };

  return (
    <ListItem onClick={handleClick} key={route.path} disablePadding sx={{ display: 'block' }}>
      <ListItemButton selected={selected}>
        {!!handle?.icon && <ListItemIcon>{handle.icon}</ListItemIcon>}
        <ListItemText primary={handle?.name} />
        {extra}
      </ListItemButton>
    </ListItem>
  );
};

const CollapseMenuRender: React.FC<{ route: RouteObject }> = ({ route }) => {
  const handle: RouteObjectHandle = route.handle;
  const [open, setOpen] = useState(false);

  if (handle.hideInMenu) return null;

  return (
    <>
      <MenuRender
        onClick={() => setOpen((pre) => !pre)}
        isLink={false}
        route={route}
        extra={open ? <ExpandLess /> : <ExpandMore />}
      />

      <Collapse in={open} timeout='auto'>
        <List component='div' disablePadding>
          {renderMenuList(route.children)}
        </List>
      </Collapse>
    </>
  );
};

export default function MenuContent() {
  const mainRoute = useMemo(() => {
    return (get(routes, ['0', 'children']) as RouteObject[])?.find((route) => route.path === '/');
  }, []);

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
      <List dense>{renderMenuList(mainRoute?.children)}</List>
    </Stack>
  );
}
