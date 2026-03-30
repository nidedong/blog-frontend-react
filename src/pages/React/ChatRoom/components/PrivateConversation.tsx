import Stack from '@mui/material/Stack';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { safeShowValue } from '@/utils';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { BadgeCount, UserStatus } from '@/components';
import { IConversationDetail, IMessage } from '../store';
import { head } from 'lodash-es';
import { Link } from 'react-router';

export interface IPrivateConversationProps {
  data?: IConversationDetail;
  unreadCount?: number;
  isOnline?: boolean;
  selected?: boolean;
  lastMsg?: IMessage;
}

const PrivateConversation: React.FC<IPrivateConversationProps> = ({
  data,
  unreadCount,
  isOnline,
  selected,
  lastMsg,
}) => {
  const chatMember = head(data?.members);
  return (
    <Link to={`/react/chatroom/conversation/${data?.id}`}>
      <ListItem sx={{ p: 0 }}>
        <ListItemButton
          selected={selected}
          sx={{
            height: 60,
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
            <UserStatus isOnline={isOnline}>
              <Avatar src={chatMember?.avatar} />
            </UserStatus>
            <Stack sx={{ flex: 1, minWidth: 0 }} direction='column' justifyItems='center'>
              <Typography variant='subtitle1'>{safeShowValue(chatMember?.nickName)}</Typography>
              <Typography
                variant='subtitle2'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  minHeight: 22,
                }}
              >
                {safeShowValue(lastMsg?.content, '')}
              </Typography>
            </Stack>
          </Stack>

          <BadgeCount count={unreadCount} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default React.memo(PrivateConversation);
