import { create } from 'zustand';
import { MessageSendStatus } from './constants';
import { produce } from 'immer';
import { IConversationDto, IMessageDto, IMsgListRes, ISendMsgParams } from './service';
import { isTmpMsg, toMessageVM } from './utils';
import { head, last } from 'lodash-es';

export type IStandardMsg = IMessageDto & {
  sendStatus?: MessageSendStatus;
};
export type ITmpMsg = ISendMsgParams & {
  sendStatus?: MessageSendStatus;
};

export type IMessage = IStandardMsg | ITmpMsg;

export interface IConvPageState {
  // 分页游标
  beforeSeq?: number; // 当前已加载最早的一条
  afterSeq?: number; // 当前已加载最新的一条（用于增量）
  // 是否还有数据
  hasMoreBefore: boolean; // 是否还能向上翻
  hasMoreAfter: boolean; // 是否还能向下拉（一般用于漫游）
}

export interface IConvScrollState {
  scrollTop: number; // 当前滚动高度
  scrollHeight: number; // 内容高度（用于恢复）
  lastReadMessageId?: string; // 上次看到的消息
  viewportLastSeq: number | undefined;
}

// 会话态
interface IConversationSummary {
  convId: string;
  // 最后一条消息
  lastMsg?: IMessage;
  // 已读 / 未读
  unreadCount: number;
  lastReadSeq?: number;

  // 会话属性
}

// 会话详情
export interface IConversationDetail extends IConversationDto {
  /** 缓存消息 */
  messages: IMessage[];
  /** 输入框草稿 */
  draft: string | undefined;
  page: IConvPageState;
  scroll: IConvScrollState;
}

export interface IChatRoomState {
  convDetailMap: Partial<Record<string, IConversationDetail>>;
  convSummaryMap: Partial<Record<string, IConversationSummary>>;
  // 会话id排序
  convOrder: string[];
  activeConvId?: string;
}

export interface IGlobalAction {
  setState: (
    next: ((state: IChatRoomState) => Partial<IChatRoomState>) | Partial<IChatRoomState>
  ) => void;
  reset: () => void;
  setActiveConvId: (id: string | undefined) => void;
  addConv: (conv: IConversationDetail) => void;
  initMsgList: (convId: string, result: IMsgListRes) => void;
  loadBeforeMsgs: (convId: string, result: IMsgListRes) => void;
  loadAfterMsgs: (convId: string, result: IMsgListRes) => void;
  addMessage: (msg: IMessage) => void;
  updateTmpMsg: (convId: string, clientId: string, msg: Partial<ITmpMsg>) => void;
  saveDraft: (convId: string, draft: string) => void;
  clearDraft: (convId: string) => void;
  saveScrollState: (convId: string, state: IConvScrollState) => void;
  updateUnreadCount: (convId: string, count: number) => void;
  clearUnreadCount: (convId: string) => void;
}

export const initialState: IChatRoomState = {
  convOrder: [],
  convDetailMap: {},
  convSummaryMap: {},
  activeConvId: undefined,
};

function moveConvToTop(convOrder: string[], convId: string) {
  const idx = convOrder.indexOf(convId);
  if (idx === -1) return convOrder;

  return [convId, ...convOrder.slice(0, idx), ...convOrder.slice(idx + 1)];
}

export const useChatRoomState = create<IChatRoomState & IGlobalAction>((set, getState) => {
  return {
    ...initialState,
    setState: (next) => set(next),
    reset: () => set(initialState),
    setActiveConvId: (id: string | undefined) => {
      set({
        activeConvId: id,
      });
    },
    addConv(conv: IConversationDetail) {
      const { convOrder, convSummaryMap, convDetailMap } = getState();
      if (convDetailMap[conv.id]) return;
      set({
        convOrder: [conv.id, ...convOrder],
        convDetailMap: {
          ...convDetailMap,
          [conv.id]: conv,
        },
        convSummaryMap: {
          ...convSummaryMap,
          [conv.id]: {
            convId: conv.id,
            lastMsg: conv.lastMessage,
            lastReadSeq: conv.lastMessage?.seq,
            unreadCount: conv.unreadCount,
          },
        },
      });
    },
    addMessage(msg: IMessage) {
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const targetConv = draft[msg.conversationId];
          if (!targetConv) return;
          if (!targetConv.messages) {
            targetConv.messages = [];
          }
          targetConv.messages.push(msg);
        }),
        convSummaryMap: produce(getState().convSummaryMap, (draft) => {
          const convSummary = draft[msg.conversationId];
          if (!convSummary) return;
          convSummary.lastMsg = msg;
        }),
        // 更新排序
        convOrder: moveConvToTop(getState().convOrder, msg.conversationId),
      });
    },
    updateTmpMsg(convId: string, clientId: string, msg: Partial<ITmpMsg>) {
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const targetConv = draft[convId];
          const targetIndex = targetConv?.messages.findIndex(
            (msg) => isTmpMsg(msg) && msg.clientId === clientId
          );
          if (!targetConv || !targetIndex || targetIndex === -1) return;
          targetConv.messages[targetIndex] = {
            ...targetConv.messages[targetIndex],
            ...msg,
          };
        }),
        convSummaryMap: produce(getState().convSummaryMap, (draft) => {
          const convSummary = draft[msg.conversationId!]!;
          if (!convSummary) return;
          convSummary.lastMsg = Object.assign({}, convSummary.lastMsg, msg);
        }),
      });
    },
    initMsgList(convId: string, result: IMsgListRes) {
      const msgs = result.list;
      if (msgs.length === 0) return;
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const conv = draft[convId];
          if (!conv) return;
          conv.messages = msgs.map((msg) => toMessageVM(msg));
          conv.page = {
            beforeSeq: head(msgs)?.seq,
            afterSeq: last(msgs)?.seq,
            hasMoreBefore: result.hasMoreBefore,
            hasMoreAfter: result.hasMoreAfter,
          };
        }),
      });
    },
    loadBeforeMsgs(convId: string, result: IMsgListRes) {
      const msgs = result.list;
      if (msgs.length === 0) return;
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const conv = draft[convId];
          if (!conv) return;
          conv.messages = [...msgs.map((msg) => toMessageVM(msg)), ...conv.messages];
          conv.page = {
            ...conv.page,
            beforeSeq: head(msgs)?.seq,
            hasMoreBefore: result.hasMoreBefore,
          };
        }),
      });
    },
    loadAfterMsgs(convId: string, result: IMsgListRes) {
      const msgs = result.list;
      if (msgs.length === 0) return;
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const conv = draft[convId];
          if (!conv) return;
          conv.messages = [...conv.messages, ...msgs.map((msg) => toMessageVM(msg))];
          conv.page = {
            ...conv.page,
            afterSeq: last(msgs)?.seq,
            hasMoreAfter: result.hasMoreAfter,
          };
        }),
      });
    },
    saveScrollState(convId: string, state: IConvScrollState) {
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const conv = draft[convId];
          if (!conv) return;
          conv.scroll = {
            ...conv.scroll,
            ...state,
          };
        }),
      });
    },
    saveDraft(convId: string, str: string) {
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const conv = draft[convId];
          if (!conv) return;
          conv.draft = !str ? undefined : str;
        }),
      });
    },
    clearDraft(convId: string) {
      set({
        convDetailMap: produce(getState().convDetailMap, (draft) => {
          const conv = draft[convId];
          if (!conv) return;
          conv.draft = undefined;
        }),
      });
    },
    updateUnreadCount(convId: string, count: number) {
      set({
        convSummaryMap: produce(getState().convSummaryMap, (draft) => {
          if (!draft[convId]) return;
          draft[convId].unreadCount = count;
        }),
      });
    },
    clearUnreadCount(convId: string) {
      set({
        convSummaryMap: produce(getState().convSummaryMap, (draft) => {
          if (!draft[convId] || draft[convId].unreadCount === 0) return;
          draft[convId].unreadCount = 0;
        }),
      });
    },
  };
});
