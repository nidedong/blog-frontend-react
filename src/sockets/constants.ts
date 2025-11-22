export enum SocketNameSpace {
  NOTIFICATION = '/notification',
  CHAT = '/chat',
}

export enum NotificationEvent {
  // 广播
  BROADCAST = 'BROADCAST',
  FRIEND_REQUEST = 'FRIEND_REQUEST',
}
export enum ChatEvent {
  NEW_MESSAGE = 'NEW_MESSAGE',
}
