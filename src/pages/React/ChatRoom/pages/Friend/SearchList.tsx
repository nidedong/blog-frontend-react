import { Empty, SearchInput } from '@/components';
import { ISearchUserParams, IUserItem, searchNoRelationUserListApi } from '@/services';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import React, { useRef, useState } from 'react';
import { QueryKey, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import FriendItem from '../../components/FriendItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneIcon from '@mui/icons-material/Done';
import { sendFriendReqApi } from '../../service';
import { useInfiniteScroll } from '@/hooks';
import { flatten } from 'lodash-es';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { produce } from 'immer';

const PAGE_SIZE = 10;
const MAX_PAGE = 3;

const SearchList = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { register, getValues } = useForm<{ keyword: string }>();
  const [params, setParams] = useState<Partial<ISearchUserParams>>({});
  const scrollContainerRef = useRef(null);

  const queryKey: QueryKey = ['searchNoRelationUserListApi', params];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey,
    initialPageParam: { start: 0, end: PAGE_SIZE - 1, ...params },
    queryFn: ({ pageParam }) =>
      searchNoRelationUserListApi(pageParam).then((res) => ({
        ...res,
        list: res.list?.map((item) => ({ ...item, isLoading: false, isFriend: false })),
      })),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const start = lastPageParam.end + 1;
      const end = lastPageParam.end + PAGE_SIZE;

      if (lastPage.list.length === 0 || start > lastPage.total || allPages.length >= MAX_PAGE) {
        return undefined;
      }
      return {
        ...lastPageParam,
        start,
        end,
      };
    },
    enabled: !!params.keyword,
    gcTime: 0,
  });

  const dataSource = flatten(data?.pages.map((item) => item.list));

  const bottomRef = useInfiniteScroll({
    loading: isFetchingNextPage,
    hasMore: hasNextPage,
    onLoadMore: fetchNextPage,
    threshold: 100,
    scrollContainer: scrollContainerRef.current,
  });

  const sendReqMutation = useMutation({
    mutationFn: sendFriendReqApi,
  });

  const handleSearch = () => {
    setParams((pre) => ({ ...pre, keyword: getValues().keyword }));
  };

  const handleSendReq = (receiver: IUserItem, page: number, index: number) => {
    queryClient.setQueryData(queryKey, (originData: typeof data) => {
      return produce(originData, (draft) => {
        if (draft?.pages[page].list[index]) {
          draft.pages[page].list[index].isLoading = true;
        }
      });
    });
    sendReqMutation.mutate(
      {
        receiverId: receiver.id,
      },
      {
        onSuccess() {
          queryClient.setQueryData(queryKey, (originData: typeof data) => {
            return produce(originData, (draft) => {
              if (draft?.pages[page].list[index]) {
                draft.pages[page].list[index].isLoading = false;
                draft.pages[page].list[index].isFriend = true;
              }
            });
          });

          queryClient.refetchQueries({ queryKey: ['getFriendReqListApi'] });
        },
      }
    );
  };

  let contentNode: React.ReactNode = null;

  if (!dataSource || dataSource.length === 0) {
    contentNode = <Empty />;
  } else {
    let bottomTip: string = '';

    if (!hasNextPage) {
      bottomTip = t('tip.no_more_data') + '~';
    }

    if (!hasNextPage && data?.pages.length === MAX_PAGE) {
      bottomTip =
        t('tip.maximum_show_count_is') +
        PAGE_SIZE * MAX_PAGE +
        ',' +
        t('tip.plz_input_exact_keyword') +
        '~';
    }

    contentNode = (
      <Box ref={scrollContainerRef} sx={{ flex: 1, overflow: 'auto' }}>
        {dataSource?.map((item, index) => {
          let extraNode: React.ReactNode = null;
          if (item.isLoading) {
            extraNode = <CircularProgress color='primary' sx={{ mr: 1 }} size={24} />;
          } else if (item.isFriend) {
            extraNode = (
              <Tooltip title={t('user.add_friend_req_sent')}>
                <DoneIcon color='success' sx={{ mr: 1 }} />
              </Tooltip>
            );
          } else {
            extraNode = (
              <Tooltip title={t('user.send_add_friend_req')}>
                <PersonAddIcon
                  sx={{ mr: 1 }}
                  onClick={handleSendReq.bind(
                    null,
                    item,
                    Math.floor(index / PAGE_SIZE),
                    Math.floor(index % PAGE_SIZE)
                  )}
                />
              </Tooltip>
            );
          }

          return (
            <Box key={item.id} sx={{ px: 2 }}>
              <FriendItem data={item} extra={extraNode} />
            </Box>
          );
        })}
        <Typography
          variant='subtitle2'
          color='textDisabled'
          ref={bottomRef}
          sx={{ py: 1, textAlign: 'center' }}
        >
          {bottomTip}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ height: '100%' }}>
      <SearchInput
        {...register('keyword')}
        sx={{ pb: 1, px: 2 }}
        slotProps={{
          input: {
            endAdornment: (
              <Button variant='contained' size='small' onClick={handleSearch}>
                {t('action.search')}
              </Button>
            ),
          },
        }}
      />

      {contentNode}
    </Stack>
  );
};

export default SearchList;
