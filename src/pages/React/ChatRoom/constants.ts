export enum FriendReqStatus {
  Waiting,
  Agree,
  Reject,
  Expire,
}

export enum FriendStatus {
  Normal,
  Block,
}

export enum ConversationType {
  PRIVATE = 0,
  GROUP = 1,
}

export enum MessageType {
  TEXT = 0,
  IMAGE = 1,
  FILE = 2,
  STICKER = 3,
}

export enum MessageStatus {
  NORMAL = 0,
  REVOKE = 1,
  DefaultStatusMessage = 2,
}

export enum MessageSendStatus {
  LOADING = 0,
  ERROR = 1,
}
