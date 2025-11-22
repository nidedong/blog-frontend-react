import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { safeShowValue } from '@/utils';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { IUserItem } from '@/services';

export interface IFriendItemProps extends ListItemProps {
  data?: IUserItem;
  extra?: React.ReactNode;
}

const FriendItem: React.FC<IFriendItemProps> = ({ data, extra }) => {
  return (
    <ListItem
      sx={(theme) => ({
        p: 0,
        borderTop: `1px solid ${theme.vars?.palette.divider}`,
        [`&:hover`]: { borderColor: theme.vars?.palette.action.selected },
      })}
    >
      <ListItemButton
        sx={(theme) => ({
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderRadius: 2,
          [`&:hover`]: {
            backgroundColor: theme.vars?.palette.action.selected,
          },
        })}
      >
        <Stack
          sx={{ display: 'flex', alignItems: 'center', pl: 1, flex: 1, minWidth: 0 }}
          spacing={1}
          direction='row'
        >
          <Avatar src={data?.avatar} />

          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant='subtitle2'>{safeShowValue(data?.nickName)}</Typography>
            <Typography
              variant='subtitle2'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {safeShowValue(data?.email)}
            </Typography>
          </Stack>
        </Stack>

        {extra ? <Box>{extra}</Box> : null}
      </ListItemButton>
    </ListItem>
  );
};

export default React.memo(FriendItem);
