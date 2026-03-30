import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import useGetMsgList from '../hooks/useGetMsgList';
import { useDebounceFn, useUpdateLayoutEffect } from 'ahooks';
import useActiveConv from '../hooks/useActiveConv';
import { useTranslation } from 'react-i18next';
import { useChatRoomState } from '../store';
import { isTmpMsg } from '../utils';
import { useUpdateMsg } from '@/sockets';

export const SCROLL_BOX_ID = 'MESSAGE_SCROLLER_ID';
const SCROLL_THRESHOLD = 100;

export interface IMessageListProps {
  isAddingMsgRef: React.MutableRefObject<boolean>;
}

const MessageList: React.ForwardRefRenderFunction<any, IMessageListProps> = (
  { isAddingMsgRef },
  ref
) => {
  const { t } = useTranslation();
  const conversationId = useActiveConv()?.id;
  const listRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const preHeightRef = useRef<number | null>(null);
  const isInitRef = useRef<boolean>(true);
  const msgObserverRef = useRef<IntersectionObserver>();
  const visibleSeqSet = useRef<Set<number>>(new Set());
  const lastReportedSeq = useRef(0);
  const { readMsg } = useUpdateMsg();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const saveScrollState = useChatRoomState((s) => s.saveScrollState);

  const { loading, messages, getInitialMsgList, getBeforeMsgList, getAfterMsgList } =
    useGetMsgList();

  // useImperativeHandle(ref, () => {});

  const debouceRead = useDebounceFn(
    () => {
      if (!conversationId) return;
      const maxVisibleSeq = Math.max(...visibleSeqSet.current, 0);
      // 单调递增约束
      if (maxVisibleSeq > lastReportedSeq.current) {
        readMsg({
          conversationId,
          readSeq: maxVisibleSeq,
        });
        lastReportedSeq.current = maxVisibleSeq;
      }
    },
    {
      wait: 1000,
      leading: true,
    }
  );

  // mount and unmount
  useEffect(() => {
    isInitRef.current = true;
    getInitialMsgList();

    return () => {
      visibleSeqSet.current.clear();
      lastReportedSeq.current = 0;
      debouceRead.cancel();
    };
  }, [conversationId]);

  // 初始化
  useUpdateLayoutEffect(() => {
    if (!listRef.current || !isInitRef.current) return;
    listRef.current.scrollTop += listRef.current.scrollHeight;
    isInitRef.current = false;
  }, [messages.length]);

  // 发送或接受新消息时
  useUpdateLayoutEffect(() => {
    if (!listRef.current || !isAddingMsgRef.current) return;
    listRef.current.scrollTop += listRef.current.scrollHeight;
    isAddingMsgRef.current = false;
  }, [messages.length]);

  // 向上滚动加载设置滚动条位置
  useLayoutEffect(() => {
    if (!listRef.current || preHeightRef.current === null) return;
    listRef.current.scrollTop += listRef.current.scrollHeight - preHeightRef.current;
    preHeightRef.current = null;
  }, [messages.length]);

  // 监听向上滚动
  useEffect(() => {
    const root = listRef.current;
    const target = topSentinelRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preHeightRef.current = root.scrollHeight;
          getBeforeMsgList();
        }
      },
      {
        root,
        threshold: 0,
        rootMargin: `${SCROLL_THRESHOLD}px 0px 0px 0px`,
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [conversationId]);

  // 监听向下滚动
  useEffect(() => {
    const root = listRef.current;
    const target = bottomSentinelRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getAfterMsgList();
        }
      },
      {
        root,
        threshold: 0,
        rootMargin: `0px 0px ${SCROLL_THRESHOLD}px 0px`,
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [conversationId]);

  // 判断是否贴底
  useEffect(() => {
    const root = listRef.current;
    const target = bottomSentinelRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      {
        root,
        threshold: 1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [conversationId]);

  const registerMsg = (el: HTMLElement | null, seq: number) => {
    if (!el || !seq || !msgObserverRef.current) return;
    msgObserverRef.current.observe(el);
  };

  //  已读 / 可见性
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const seq = Number((entry.target as HTMLElement).dataset.seq);
          if (!seq) return;
          if (entry.isIntersecting) {
            visibleSeqSet.current.add(seq);
          } else {
            visibleSeqSet.current.delete(seq);
          }
        });
        debouceRead.run();
      },
      {
        root,
        threshold: 0.6,
      }
    );

    msgObserverRef.current = observer;
    return () => {
      observer.disconnect();
      msgObserverRef.current = undefined;
    };
  }, [conversationId]);

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
      }}
      ref={listRef}
      id={SCROLL_BOX_ID}
    >
      <Box sx={{ height: 25, textAlign: 'center', lineHeight: '25px' }} ref={topSentinelRef}>
        {loading ? t('tip.loading') : ''}
      </Box>
      {/* 顶部哨兵 */}
      {messages?.map((msg) => {
        if (isTmpMsg(msg)) {
          return (
            <div
              key={msg.clientId}
              style={{ height: 200, marginBottom: 8, border: '1px solid red' }}
            >
              {msg.content}-{msg.sendStatus}
            </div>
          );
        }
        return (
          <div
            ref={(el) => registerMsg(el, msg.seq)}
            data-seq={msg.seq}
            key={msg.id}
            style={{ height: 200, marginBottom: 8, border: '1px solid red' }}
          >
            {msg.seq}-{msg.content}-{msg.sendStatus}
          </div>
        );
      })}
      <Box sx={{ height: '1px' }} ref={bottomSentinelRef} /> {/* 底部哨兵 */}
    </Box>
  );
};

export default React.memo(MessageList);
