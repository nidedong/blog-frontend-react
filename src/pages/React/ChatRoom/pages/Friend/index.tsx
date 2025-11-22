import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import HeadBox from '../../components/HeadBox';
import ToogleButtonList from '@/components/ToogleButtonList';
import { friendOptions, FriendReqStatus } from '../../constants';
import { ALL_VALUE } from '@/constants';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { Modal, SearchInput } from '@/components';
import Button from '@mui/material/Button';
import SearchList from './SearchList';
import { isNil, last } from 'lodash-es';
import { Outlet, useMatches, useNavigate } from 'react-router';
import { useUpdateEffect } from 'ahooks';

const Friend = () => {
  const match = useMatches();
  const initialCategory =
    last(match)?.pathname === '/react/chatroom/friend/pending'
      ? FriendReqStatus.Waiting
      : ALL_VALUE;

  const [category, setCategory] = useState<FriendReqStatus | typeof ALL_VALUE>(initialCategory);
  const [keyword, setKeyword] = useState('');
  const { t } = useTranslation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();

  useUpdateEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <HeadBox>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToogleButtonList
            value={category}
            onChange={(_, value) => {
              if (isNil(value)) return;
              setKeyword('');
              setCategory(value);
              if (value === ALL_VALUE) {
                navigate('/react/chatroom/friend');
              } else {
                navigate('/react/chatroom/friend/pending');
              }
            }}
            exclusive
            items={friendOptions}
          />
          <Button variant='contained' size='small' onClick={() => setSearchModalOpen(true)}>
            添加好友
          </Button>
        </Box>

        <Tooltip title={t('chat.create_conversation')}>
          <ButtonBase>
            <AddCommentIcon
              sx={(theme) => ({
                color: theme.vars?.palette.text.secondary,
                [`&:hover`]: {
                  color: theme.vars?.palette.text.primary,
                },
              })}
            />
          </ButtonBase>
        </Tooltip>
      </HeadBox>
      <Box sx={{ px: 3, py: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <SearchInput value={keyword} onChange={(e) => setKeyword(e.currentTarget.value)} />
        <Box sx={{ pt: 2, flex: 1, overflowY: 'auto' }}>
          <Outlet context={{ keyword }} />
        </Box>
      </Box>

      <Modal
        title={t('user.add_friend')}
        subTitle={t('user.add_friend_by_name')}
        open={searchModalOpen}
        footer={null}
        onClose={() => setSearchModalOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 450,
            },
          },
        }}
      >
        <SearchList />
      </Modal>
    </Box>
  );
};

export default React.memo(Friend);
