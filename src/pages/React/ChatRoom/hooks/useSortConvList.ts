import { useMemo } from 'react';
import { useChatRoomState } from '../store';

const useSortConvList = () => {
  const convOrder = useChatRoomState((s) => s.convOrder);
  const convDetailMap = useChatRoomState((s) => s.convDetailMap);
  return useMemo(
    () => convOrder.filter((cid) => !!convDetailMap[cid]).map((cid) => convDetailMap[cid]!),
    [convOrder, convDetailMap]
  );
};

export default useSortConvList;
