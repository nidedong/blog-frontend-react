import { useQuery } from '@tanstack/react-query';
import { getConversationListApi } from '../service';
import { IChatRoomState, useChatRoomState } from '../store';
import { toConversationVM } from '../utils';
import { usePresenceMutation } from '@/hooks';
import { ConversationType } from '../constants';

const useGetConvList = () => {
  const setState = useChatRoomState((s) => s.setState);
  const presenceMutation = usePresenceMutation();

  return useQuery({
    queryFn: () =>
      getConversationListApi().then((convList) => {
        const userIds = convList
          .filter((conv) => conv.type === ConversationType.PRIVATE)
          .flatMap((conv) => conv.members)
          .map((m) => m.id);

        if (userIds.length > 0) {
          presenceMutation.mutate({
            ids: userIds,
          });
        }

        const convSummaryMap: IChatRoomState['convSummaryMap'] = {};
        const convDetailMap: IChatRoomState['convDetailMap'] = {};
        const convOrder: string[] = [];

        convList.forEach((conv) => {
          convOrder.push(conv.id);
          convSummaryMap[conv.id] = {
            convId: conv.id,
            lastMsg: conv.lastMessage,
            lastReadSeq: conv.lastMessage?.seq,
            unreadCount: conv.unreadCount,
          };
          convDetailMap[conv.id] = toConversationVM(conv);
        });

        setState({
          convOrder,
          convDetailMap,
          convSummaryMap,
        });
      }),
    queryKey: ['getConversationListApi'],
  });
};

export default useGetConvList;
