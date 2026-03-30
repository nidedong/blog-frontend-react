import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, { useEffect, useRef, useState } from 'react';
import HeaderBox from '../../components/HeadBox';
import { ActiveIcon } from '@/components';
import { safeShowValue } from '@/utils';
import { useChatRoomState } from '../../store';
import Paper from '@mui/material/Paper';
import ContactsIcon from '@mui/icons-material/Contacts';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import SendBar, { ISendBarProps } from '../../components/SendBar';
import MessageList from '../../components/MessageList';
import { useMemoizedFn } from 'ahooks';
import { useMutation } from '@tanstack/react-query';
import { sendMessageApi } from '../../service';
import { MessageSendStatus } from '../../constants';
import { useSocketEmitter } from '@/sockets';
import useActiveConv from '../../hooks/useActiveConv';
import { useGlobalState } from '@/stores/global';
import { isNil } from 'lodash-es';
import MemberInfo from '../../components/MemberInfo';

const Conversation = () => {
  const { t } = useTranslation();
  const isAddingMsgRef = useRef(false);
  const emitter = useSocketEmitter();
  const activeConvId = useChatRoomState((s) => s.activeConvId);
  const [siderStatus, setSiderStatus] = useState<'profile' | undefined>();
  const targetConv = useActiveConv();
  const addMessage = useChatRoomState((s) => s.addMessage);
  const updateTmpMsg = useChatRoomState((s) => s.updateTmpMsg);
  const clearUnreadCount = useChatRoomState((s) => s.clearUnreadCount);
  const convSummaryMap = useChatRoomState((s) => s.convSummaryMap);
  const setMessageUnread = useGlobalState((s) => s.setMessageUnread);

  const sendMutate = useMutation({
    mutationFn: sendMessageApi,
  });

  // enter conv
  useEffect(() => {
    if (!activeConvId) return;
    clearUnreadCount(activeConvId);
    if (!isNil(convSummaryMap[activeConvId]?.unreadCount)) {
      setMessageUnread((pre) => pre - convSummaryMap[activeConvId]!.unreadCount);
    }
  }, [activeConvId]);

  useEffect(() => {
    emitter.on('chat:new_message', (payload) => {
      isAddingMsgRef.current = true;
      addMessage(payload.message);
    });
  }, [emitter]);

  const handleSend = useMemoizedFn<NonNullable<ISendBarProps['onSend']>>(async (message) => {
    if (!activeConvId) return;
    isAddingMsgRef.current = true;
    addMessage({
      ...message,
      sendStatus: MessageSendStatus.LOADING,
    });
    try {
      const rebuildMsg = await sendMutate.mutateAsync(message);
      // 乐观更新
      updateTmpMsg(activeConvId, rebuildMsg.clientId, {
        ...rebuildMsg,
        sendStatus: undefined,
        clientId: undefined,
      });
    } catch (error) {
      console.error('🚀 ~ Conversation ~ error:', error);
      updateTmpMsg(activeConvId, message.clientId, {
        sendStatus: MessageSendStatus.ERROR,
      });
    }
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <HeaderBox>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar src={targetConv?.avatar} />
          <Typography variant='subtitle2'>{safeShowValue(targetConv?.title, '')}</Typography>
        </Stack>

        <Stack spacing={1} direction='row'>
          <Tooltip title={t('chat.show_user_profile')}>
            <ActiveIcon
              actived={!!siderStatus}
              onChange={(actived) => setSiderStatus(actived ? 'profile' : undefined)}
            >
              <ContactsIcon />
            </ActiveIcon>
          </Tooltip>
        </Stack>
      </HeaderBox>
      <Stack sx={{ flex: 1, minHeight: 0 }} flexDirection='row'>
        <Stack
          sx={{
            flex: 1,
            minWidth: 0,
            boxSizing: 'border-box',
            height: '100%',
            p: 1,
            pr: 0,
          }}
          spacing={1}
        >
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <MessageList isAddingMsgRef={isAddingMsgRef} />
          </Box>
          <Box sx={{ pr: 1 }}>
            <SendBar onSend={handleSend} />
          </Box>
        </Stack>
        {!!siderStatus && (
          <Paper sx={{ width: 370, height: '100%', overflowY: 'auto' }}>
            <MemberInfo />
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default React.memo(Conversation);
