import { IUserInfo } from '@/types';
import { request } from '@/utils';
import {
  ConversationType,
  FriendReqStatus,
  FriendStatus,
  MessageStatus,
  MessageType,
} from './constants';
import { IUserItem } from '@/services';

export interface IFriendItem extends IUserItem {
  status: FriendStatus;
  conversationId: string;
}

export const getFriendListApi = (): Promise<IFriendItem[]> =>
  request({
    url: '/friend',
    method: 'get',
  });

export interface IGetFriendReqListParams {
  status: FriendReqStatus;
}

export interface IFriendReqItemAction {
  isAgreeing?: boolean;
  isRejecting?: boolean;
}

export interface IFriendReqItem extends IFriendReqItemAction {
  status: FriendReqStatus;
  senderId: string;
  receiverId: string;
  message?: string;
  receiver: IUserInfo;
  sender: IUserInfo;
  id: string;
}

export const getFriendReqListApi = (params: IGetFriendReqListParams): Promise<IFriendReqItem[]> =>
  request({
    url: '/friend/request',
    method: 'get',
    params,
  });

export const sendFriendReqApi = (params: {
  receiverId: string;
  message?: string;
}): Promise<IFriendReqItem[]> =>
  request({
    url: '/friend/request',
    method: 'post',
    data: params,
  });

export interface MemberShortInfoDto {
  id: string;
  nickName: string;
  userId: string;
  avatar: string;
}

export interface IConversationDto {
  id: string;
  type?: ConversationType;
  title?: string;
  avatar?: string;
  metadata?: Record<string, any>;
  unreadCount: number;
  updatedAt: Date;
  lastMessage: IMessageDto | undefined;
  lastMessageTime: Date;
  members: MemberShortInfoDto[];
  createAt: Date;
  updateAt: Date | undefined;
}

export const handleFriendReqApi = (params: {
  id: string;
  status: FriendReqStatus;
}): Promise<{
  conversation: IConversationDto | undefined;
  unreadCount: number;
}> =>
  request({
    url: `/friend/request/${params.id}/handle`,
    method: 'put',
    data: params,
  });

export const getConversationListApi = (): Promise<IConversationDto[]> => {
  return request({
    url: '/conversation/list',
    method: 'get',
  });
};

export interface ISendMsgParams {
  conversationId: string;
  clientId: string;
  replyTo?: string;
  type: MessageType;
  content?: string;
  metedata?: Record<string, any>;
}

export interface IMessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  replyTo: string;
  type: MessageType;
  status: MessageStatus;
  content?: string;
  metadata?: Record<string, any>;
  createAt: Date;
  seq: number;
}

export const sendMessageApi = (
  data: ISendMsgParams
): Promise<IMessageDto & { clientId: string }> => {
  return request({
    url: '/message/send',
    method: 'post',
    data,
  });
};

export interface IGetMsgListParams {
  conversationId: string;
  limit: number;
  beforeSeq?: number;
  afterSeq?: number;
}

export interface IMsgListRes extends IResPaginationData<IMessageDto> {
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
}

export const getMessageListApi = (params: IGetMsgListParams): Promise<IMsgListRes | undefined> => {
  return request({
    url: '/message/list',
    method: 'get',
    params,
  });
};

export interface IGetConvMemberParams {
  cid: string;
  userId: string;
}

export interface IConvMember {
  id: string;
  nickName: string;
  userId: string;
  avatar?: string;
  gender: number;
  email: number;
  lastLoginTime: Date;
  conversationId: string;
  joinedAt: Date;
}

export const getConvMembersApi = (params: IGetConvMemberParams): Promise<IConvMember> => {
  return request({
    url: `/conversation/${params.cid}/members/${params.userId}`,
    method: 'get',
    params,
  });
};
