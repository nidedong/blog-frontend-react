import { useChatRoomState } from '../store';

const useActiveConv = () => {
  const convDetailMap = useChatRoomState((s) => s.convDetailMap);
  const activeConvId = useChatRoomState((s) => s.activeConvId);
  return activeConvId ? convDetailMap[activeConvId] : undefined;
};

export default useActiveConv;
