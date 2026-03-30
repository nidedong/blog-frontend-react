import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import HeaderBox from '../../components/HeadBox';
import { ActiveIcon } from '@/components';
import { useParams } from 'react-router';
import { safeShowValue } from '@/utils';
import Paper from '@mui/material/Paper';
import ContactsIcon from '@mui/icons-material/Contacts';
import GroupsIcon from '@mui/icons-material/Groups';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import useActiveConv from '../../hooks/useActiveConv';

const Group = () => {
  const { t } = useTranslation();
  const targetConv = useActiveConv();
  const [siderStatus, setSiderStatus] = useState<'groupInfo' | undefined>();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <HeaderBox>
        <Stack direction='row' spacing={1} alignItems='center'>
          {targetConv?.avatar ? (
            <Avatar src={targetConv.avatar} />
          ) : (
            <Avatar>
              <GroupsIcon sx={{ fontSize: 30 }} />
            </Avatar>
          )}
          <Typography variant='subtitle2'>{safeShowValue(targetConv?.title, '')}</Typography>
        </Stack>

        <Stack spacing={1} direction='row'>
          <Tooltip title={t('chat.show_group_info')}>
            <ActiveIcon
              actived={!!siderStatus}
              onChange={(actived) => setSiderStatus(actived ? 'groupInfo' : undefined)}
            >
              <ContactsIcon />
            </ActiveIcon>
          </Tooltip>
        </Stack>
      </HeaderBox>
      <Stack sx={{ flex: 1, minHeight: 0 }} flexDirection='row'>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            boxSizing: 'content-box',
            height: '100%',
            overflowY: 'auto',
            p: 1,
          }}
        >
          123
        </Box>
        {!!siderStatus && <Paper sx={{ width: 370, height: '100%', overflowY: 'auto' }}>123</Paper>}
      </Stack>
    </Box>
  );
};

export default React.memo(Group);
