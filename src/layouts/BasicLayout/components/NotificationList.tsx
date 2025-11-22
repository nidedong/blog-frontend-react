import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { NotificationItem as NotificationItemData, useNotificationStore } from '@/sockets';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import CampaignIcon from '@mui/icons-material/Campaign';
import { MultipleEllipsis } from '@/components';
import { safeShowValue } from '@/utils';
import CheckIcon from '@mui/icons-material/Check';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import Emtpy from '@/components/Empty';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getNotifiyListApi, readNotificationApi } from '../service';
import { useGlobalState } from '@/stores/global';
import { sum } from 'lodash-es';

export interface INotificationItemProps {
  data?: NotificationItemData;
}

export const NotificationItem = React.memo<INotificationItemProps>(({ data }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const readMutation = useMutation({
    mutationFn: readNotificationApi,
  });
  const setState = useNotificationStore((state) => state.setState);
  const modifyBadges = useGlobalState((state) => state.modifyBadges);

  const handleRead = () => {
    readMutation
      .mutateAsync({
        notifyId: data?.id,
        broadcastId: data?.broadcastId!,
      })
      .then(() => {
        setState((pre) => ({
          list: pre.list.filter((item) => item.broadcastId !== data?.broadcastId),
        }));
        modifyBadges((pre) => ({ notification: sum([pre.notification, -1]) }));
      });
  };

  return (
    <Box>
      <Stack direction='row' sx={{ py: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title={t('action.expand')}>
            <Typography component='a' href='#' onClick={() => setOpen((pre) => !pre)}>
              {open ? <ExpandMore /> : <KeyboardArrowRightIcon />}
            </Typography>
          </Tooltip>
          <Avatar variant='rounded'>
            <CampaignIcon />
          </Avatar>
          <MultipleEllipsis lines={2} variant='h6' sx={{ width: 250 }}>
            {safeShowValue(data?.title)}
          </MultipleEllipsis>
        </Stack>

        <Tooltip title={t('action.mark_read')} arrow placement='top'>
          <ButtonBase
            sx={{
              width: 35,
              height: 35,
              borderRadius: '50%',
              backgroundColor: (theme) => theme.vars?.palette.action.hover,
              '&:hover': {
                backgroundColor: 'unset',
              },
            }}
            onClick={handleRead}
          >
            <CheckIcon />
          </ButtonBase>
        </Tooltip>
      </Stack>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <Card>{safeShowValue(data?.content)}</Card>
      </Collapse>
    </Box>
  );
});

const NotificationList = () => {
  const list = useNotificationStore((state) => {
    return state.list;
  });

  const setState = useNotificationStore((state) => state.setState);

  const listQuery = useQuery({
    queryFn: () => getNotifiyListApi({ isRead: false }),
    queryKey: ['getNotifiyListApi'],
  });

  useEffect(() => {
    if (listQuery.isSuccess && listQuery.data) {
      setState({
        list: listQuery.data,
      });
    }
  }, [listQuery.data, listQuery.isSuccess]);

  if (listQuery.isPending) {
  }

  if (!list || list.length === 0) {
    return <Emtpy />;
  }

  return (
    <Box sx={{ pb: 1 }}>
      {list.map((data) => (
        <NotificationItem key={data.id} data={data} />
      ))}
    </Box>
  );
};

export default React.memo(NotificationList);
