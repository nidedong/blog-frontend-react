import { IUserInfo } from '@/types';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { safeShowValue } from '@/utils';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router';

export interface IConversationItemProps {
  data?: IUserInfo;
  extra?: React.ReactNode;
  selected?: boolean;
}

const ConversationItem: React.FC<IConversationItemProps> = ({ data, extra, selected }) => {
  const navigate = useNavigate();

  const handleChat = () => {
    if (!data) return;
    navigate(`/react/chatroom/conversation/${data?.id}`);
  };

  return (
    <ListItem sx={{ p: 0 }} onClick={handleChat}>
      <ListItemButton
        selected={selected}
        sx={{
          height: 55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderRadius: 2,
        }}
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
              {safeShowValue(data?.email)}似懂非懂放松放松发顺丰打撒似懂非懂放松放松发顺丰打撒
            </Typography>
          </Stack>
        </Stack>

        {extra ? <Box>{extra}</Box> : null}
      </ListItemButton>
    </ListItem>
  );
};

export default ConversationItem;
