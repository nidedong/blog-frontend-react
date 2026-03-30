import Paper from '@mui/material/Paper';
import { inputClasses } from '@mui/material/Input';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import GifBoxIcon from '@mui/icons-material/GifBox';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import React, { KeyboardEventHandler, useLayoutEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ISendMsgParams } from '../service';
import { MessageType } from '../constants';
import useActiveConv from '../hooks/useActiveConv';
import { useDebounceFn } from 'ahooks';
import { useChatRoomState } from '../store';
import uuid from 'uuid-random';

export interface ISendBarProps {
  onSend?: (message: ISendMsgParams) => void;
}

const SendBar: React.FC<ISendBarProps> = ({ onSend }) => {
  const { t } = useTranslation();
  const conv = useActiveConv();
  const conversationId = conv?.id;
  const inputRef = useRef<HTMLInputElement>(null);
  const saveDraft = useChatRoomState((s) => s.saveDraft);
  const clearDraft = useChatRoomState((s) => s.clearDraft);

  // 恢复会话输入框的草稿
  useLayoutEffect(() => {
    if (!inputRef.current || !conv) return;
    inputRef.current.value = '';
    if (!conv.draft) return;
    inputRef.current.value = conv.draft;
  }, [conv]);

  const handeKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const text: string = (e.target as any).value;
      if (!text || text.trim().length === 0) {
        toast.error(`${t('chat.send_message_not_empty')}!`);
        return;
      }
      if (!conversationId) return;
      inputRef.current!.value = '';
      clearDraft(conversationId);
      // send
      onSend?.({
        conversationId,
        type: MessageType.TEXT,
        content: text,
        clientId: uuid(),
      });
    }
  };

  const { run: handleInput } = useDebounceFn<React.FormEventHandler<HTMLInputElement>>(
    (e) => {
      if (!conversationId) return;
      saveDraft(conversationId, (e.target as any).value);
    },
    {
      wait: 400,
    }
  );

  return (
    <Paper
      sx={(theme) => ({
        border: `1px solid ${theme.vars?.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
      })}
    >
      <IconButton variant='hover'>
        <AddIcon />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          maxRows={6}
          multiline
          variant='outlined'
          placeholder={t('chat.send_input_placeholder')}
          slotProps={{
            input: {
              sx: {
                lineHeight: 22,
                fontSize: 16,
                border: 'none',
                padding: '17px 0',
                backgroundColor: 'transparent',
                [`&.${inputClasses.focused}`]: {
                  outline: 'none',
                },
              },
            },
          }}
          onKeyDown={handeKeyDown}
          onInput={handleInput}
        />
      </Box>
      <Stack direction='row'>
        <IconButton variant='hover'>
          <GifBoxIcon />
        </IconButton>
        <IconButton variant='hover'>
          <EmojiEmotionsIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default SendBar;
