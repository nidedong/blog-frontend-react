import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InboxIcon from '@mui/icons-material/Inbox';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import i18n from '@/utils/i18n';
import NotificationList from './NotificationList';
import ConversationList from './ConversationList';
import { useNavigate } from 'react-router';
import { useGlobalState } from '@/stores/global';

enum TabEnum {
  notification = 'notification',
  unread_message = 'unread_message',
}

const tabList = [
  {
    label: i18n.t('notify.notification'),
    value: TabEnum.notification,
    children: <NotificationList />,
  },
  {
    label: i18n.t('notify.unread_message'),
    value: TabEnum.unread_message,
    children: <ConversationList />,
  },
];

const InBox: React.FC<{
  setInBoxEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}> = ({ setInBoxEl }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(TabEnum.notification);
  const navigate = useNavigate();
  const user = useGlobalState((state) => state.user);

  const handleToFriends = () => {
    navigate('/react/chatroom/friend/pending');
    setInBoxEl(null);
  };

  return (
    <Paper
      variant='outlined'
      sx={{
        width: '35vw',
        maxHeight: '70vh',
        maxWidth: 600,
        minWidth: 480,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        sx={(theme) => ({
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(2),
        })}
        direction='row'
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          spacing={1}
          direction='row'
        >
          <InboxIcon />
          <Typography variant='h5'>{t('notify.inbox')}</Typography>
        </Stack>

        <Tooltip arrow title={t('notify.view_friends_req')} placement='top'>
          <Paper
            elevation={10}
            sx={(theme) => ({
              p: theme.spacing(0.8),
              '&:hover': {
                backgroundImage: theme.vars?.overlays[20],
              },
              cursor: 'pointer',
            })}
            onClick={handleToFriends}
          >
            <Stack
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              spacing={1.5}
              direction='row'
            >
              <EmojiPeopleIcon />
              <Typography fontWeight={600} variant='body1'>
                {user?.badges.friendreq ?? 0}
              </Typography>
            </Stack>
          </Paper>
        </Tooltip>
      </Stack>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
          <Tabs
            textColor='inherit'
            indicatorColor='primary'
            variant='fullWidth'
            value={tab}
            onChange={(_, key) => setTab(key)}
          >
            {tabList.map((item) => (
              <Tab value={item.value} key={item.value} label={item.label} />
            ))}
          </Tabs>
        </Box>

        {tabList.map((item) => (
          <TabPanel
            sx={{ flex: 1, minHeight: 0, overflow: 'auto', pt: 0, pb: 1, px: 1.5 }}
            value={item.value}
          >
            {item.children}
          </TabPanel>
        ))}
      </TabContext>
    </Paper>
  );
};

export default InBox;
