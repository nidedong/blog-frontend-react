import { useMemo } from 'react';
import { useChatRoomState } from '../store';
import { omit } from 'lodash-es';

const useUnreadSortConvList = () => {
  const convOrder = useChatRoomState((s) => s.convOrder);
  const convDetailMap = useChatRoomState((s) => s.convDetailMap);
  const convSummaryMap = useChatRoomState((s) => s.convSummaryMap);
  return useMemo(
    () =>
      convOrder
        .filter(
          (cid) =>
            !!convDetailMap[cid] &&
            convSummaryMap[cid]?.unreadCount &&
            convSummaryMap[cid]?.unreadCount > 0
        )
        .map((cid) => omit(convDetailMap[cid], 'message')!),
    [convOrder, convDetailMap, convSummaryMap]
  );
};

export default useUnreadSortConvList;
