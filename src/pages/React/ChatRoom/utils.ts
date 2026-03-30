import { IConversationDto, IMessageDto } from './service';
import { IConversationDetail, IMessage, ITmpMsg } from './store';

export const toConversationVM = (convDto: IConversationDto): IConversationDetail => {
  return {
    ...convDto,
    messages: [],
    draft: undefined,
    page: {
      beforeSeq: undefined,
      afterSeq: undefined,
      hasMoreBefore: false,
      hasMoreAfter: false,
    },
    scroll: {
      scrollTop: 0,
      scrollHeight: 0,
      lastReadMessageId: undefined,
      viewportLastSeq: undefined,
    },
  };
};

export const toMessageVM = (msgDto: IMessageDto): IMessage => {
  return {
    ...msgDto,
    sendStatus: undefined,
  };
};

export const isTmpMsg = (msg: IMessage): msg is ITmpMsg => !!(msg as any).clientId;
