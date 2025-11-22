import React, { useMemo } from 'react';
import FriendItem from '../../components/FriendItem';
import { Empty, Loading } from '@/components';
import { getFriendListApi, IFriendItem } from '../../service';
import { useQuery } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router';
import ChatIcon from '@mui/icons-material/Chat';
import Box from '@mui/material/Box';

const FriendList: React.FC = () => {
  const { keyword } = useOutletContext<{ keyword?: string }>();
  const { t } = useTranslation();
  const listQuery = useQuery({
    queryFn: () => getFriendListApi(),
    queryKey: ['getFriendListApi'],
  });
  const navigate = useNavigate();

  const dataSource = useMemo(() => {
    if (!keyword) return listQuery.data;
    return listQuery.data?.filter((item) => item.nickName.includes(keyword));
  }, [listQuery.data, keyword]);

  if (listQuery.isFetching) return <Loading />;
  if (!dataSource || dataSource.length === 0) return <Empty />;

  const handleChat = (data: IFriendItem) => {};

  return (
    <>
      {
        <Typography variant='subtitle2' sx={{ pb: 1 }}>
          {t('user.friends_total')} - {dataSource.length}
        </Typography>
      }
      {dataSource.map((item) => (
        <FriendItem
          data={item}
          key={item.id}
          extra={
            <Box sx={{ pr: 1 }}>
              <Tooltip title={t('chat.title')}>
                <ChatIcon onClick={handleChat.bind(null, item)} />
              </Tooltip>
            </Box>
          }
        />
      ))}
    </>
  );
};

export default React.memo(FriendList);
