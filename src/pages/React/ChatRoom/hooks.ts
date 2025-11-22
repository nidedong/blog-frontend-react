import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFriendReqListApi, IFriendReqItem } from './service';
import { FriendReqStatus } from './constants';
import { useCallback } from 'react';
import { produce } from 'immer';

export const useFriendReqList = () => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['getFriendReqListApi'];

  const query = useQuery({
    queryFn: () => getFriendReqListApi({ status: FriendReqStatus.Waiting }),
    queryKey: queryKey,
  });

  const toogleIsAgreeing = useCallback((id: string) => {
    queryClient.setQueryData<IFriendReqItem[]>(queryKey, (origin) => {
      return produce(origin, (draft) => {
        const target = draft?.find((item) => item.id === id);
        if (!target) return;
        target.isAgreeing = !target.isAgreeing;
      });
    });
  }, []);

  const toogleIsRejecting = useCallback((id: string) => {
    queryClient.setQueryData<IFriendReqItem[]>(queryKey, (origin) => {
      return produce(origin, (draft) => {
        const target = draft?.find((item) => item.id === id);
        if (!target) return;
        target.isRejecting = !target.isRejecting;
      });
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    queryClient.setQueryData<IFriendReqItem[]>(queryKey, (origin) => {
      return origin?.filter((item) => item.id !== id);
    });
  }, []);

  return {
    ...query,
    toogleIsAgreeing,
    toogleIsRejecting,
    removeItem,
  };
};
