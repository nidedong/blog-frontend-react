import { useMutation } from '@tanstack/react-query';
import { getMessageListApi } from '../service';
import { useChatRoomState } from '../store';
import useActiveConv from './useActiveConv';
import { useMemoizedFn } from 'ahooks';

// 1. 从 IndexedDB 读取：
//    - 最近 N 条消息
//    - oldestMessageId / newestMessageId
// 2. 恢复到 Zustand
// 3. 设置滚动位置（如有）

// 进入会话
//  ↓
// 从 IndexedDB hydrate 状态
//  ↓
// Zustand 维护内存状态（keep-alive）
//  ↓
// 滚动 → 分页请求
//  ↓
// 更新游标 + 写回 IndexedDB
//  ↓
// 切换会话 / 刷新
//  ↓
// 下次恢复

const DEFAULT_LIMIT = 10;

const useGetMsgList = () => {
  const initMsgList = useChatRoomState((s) => s.initMsgList);
  const loadBeforeMsgs = useChatRoomState((s) => s.loadBeforeMsgs);
  const loadAfterMsgs = useChatRoomState((s) => s.loadAfterMsgs);
  const conv = useActiveConv();
  const conversationId = conv?.id;

  const msgListMutation = useMutation({
    mutationFn: getMessageListApi,
  });

  const getInitialMsgList = useMemoizedFn(() => {
    if (!conversationId) return;
    return msgListMutation
      .mutateAsync({
        conversationId,
        limit: DEFAULT_LIMIT,
      })
      .then((res) => {
        if (!res) return;
        initMsgList(conversationId, res);
      });
  });

  const getBeforeMsgList = useMemoizedFn(() => {
    if (msgListMutation.isPending || !conversationId || !conv?.page.hasMoreBefore) return;
    return msgListMutation
      .mutateAsync({
        conversationId,
        beforeSeq: conv.page.beforeSeq,
        limit: DEFAULT_LIMIT,
      })
      .then((res) => {
        if (!res) return;
        loadBeforeMsgs(conversationId, res);
      });
  });

  const getAfterMsgList = useMemoizedFn(() => {
    if (msgListMutation.isPending || !conversationId || !conv?.page.hasMoreAfter) return;
    return msgListMutation
      .mutateAsync({
        conversationId,
        beforeSeq: conv.page.afterSeq,
        limit: DEFAULT_LIMIT,
      })
      .then((res) => {
        if (!res) return;
        loadAfterMsgs(conversationId, res);
      });
  });

  return {
    loading: msgListMutation.isPending,
    getInitialMsgList,
    getBeforeMsgList,
    getAfterMsgList,
    messages: conv?.messages || [],
  };
};

export default useGetMsgList;
