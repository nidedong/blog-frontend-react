import React, { useMemo } from 'react';
import FriendItem from '../../components/FriendItem';
import { Empty, IconWrap, Loading } from '@/components';
import { handleFriendReqApi, IFriendReqItem } from '../../service';
import { useMutation } from '@tanstack/react-query';
import { FriendReqStatus } from '../../constants';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useGlobalState } from '@/stores/global';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useOutletContext } from 'react-router';
import { useFriendReqList } from '../../hooks';

const FriendPendingList = () => {
  const { keyword } = useOutletContext<{ keyword?: string }>();
  const { t } = useTranslation();
  const userId = useGlobalState((state) => state.user?.id);

  const reqListQuery = useFriendReqList();
  const updateMutation = useMutation({
    mutationFn: handleFriendReqApi,
  });

  const dataSource = useMemo(() => {
    if (!keyword) return reqListQuery.data;
    return reqListQuery.data?.filter((item) => item.receiver.nickName.includes(keyword));
  }, [reqListQuery.data, keyword]);

  if (reqListQuery.isFetching) return <Loading />;
  if (!dataSource || dataSource.length === 0) return <Empty />;

  const reqList = dataSource.filter((item) => item.senderId === userId);
  const receiveList = dataSource.filter((item) => item.receiverId === userId);

  const handleAgree = async (record: IFriendReqItem) => {
    reqListQuery.toogleIsAgreeing(record.id);
    updateMutation
      .mutateAsync({
        id: record.id,
        status: FriendReqStatus.Agree,
      })
      .then(() => {
        reqListQuery.removeItem(record.id);
      })
      .finally(() => {
        reqListQuery.toogleIsAgreeing(record.id);
      });
  };

  const handleReject = (record: IFriendReqItem) => {
    reqListQuery.toogleIsRejecting(record.id);
    updateMutation
      .mutateAsync({
        id: record.id,
        status: FriendReqStatus.Reject,
      })
      .then(() => {
        reqListQuery.removeItem(record.id);
      })
      .finally(() => {
        reqListQuery.toogleIsRejecting(record.id);
      });
  };

  const handleCancel = (record: IFriendReqItem) => {
    reqListQuery.toogleIsRejecting(record.id);
    updateMutation
      .mutateAsync({
        id: record.id,
        status: FriendReqStatus.Expire,
      })
      .then(() => {
        reqListQuery.removeItem(record.id);
      })
      .finally(() => {
        reqListQuery.toogleIsRejecting(record.id);
      });
  };

  return (
    <>
      {receiveList.length > 0 && (
        <Box sx={{ pb: 2 }}>
          <Typography variant='subtitle2' sx={{ pb: 1 }}>
            {t('user.friends_receive_total')} - {receiveList.length}
          </Typography>
          {receiveList.map((item) => (
            <FriendItem
              key={item.id}
              data={item.sender}
              extra={
                <Stack direction='row' spacing={2} sx={{ pr: 1 }}>
                  <Tooltip title={t('action.agree')}>
                    <IconWrap
                      loading={item.isAgreeing}
                      element={CheckIcon}
                      onClick={handleAgree.bind(null, item)}
                    />
                  </Tooltip>
                  <Tooltip title={t('action.reject')}>
                    <IconWrap
                      loading={item.isRejecting}
                      element={ClearIcon}
                      onClick={handleReject.bind(null, item)}
                    />
                  </Tooltip>
                </Stack>
              }
            />
          ))}
        </Box>
      )}

      {reqList.length > 0 && (
        <Box>
          <Typography variant='subtitle2' sx={{ pb: 1 }}>
            {t('user.friends_req_total')} - {reqList.length}
          </Typography>
          {dataSource.map((item) => (
            <FriendItem
              key={item.id}
              data={item.receiver}
              extra={
                <Tooltip title={t('action.cancel')}>
                  <IconWrap
                    loading={item.isRejecting}
                    element={ClearIcon}
                    onClick={handleCancel.bind(null, item)}
                    sx={{ mr: 1 }}
                  />
                </Tooltip>
              }
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default React.memo(FriendPendingList);
