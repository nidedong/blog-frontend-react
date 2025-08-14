export enum RegisterType {
  EMAIL = 0,
  GOOGLE = 1,
  GITHUB = 2,
}

export interface IUserInfo {
  id: string;
  nickName: string;
  mobilePhone?: string;
  email: string;
  avatar: string;
  gender?: 0 | 1;
  remark?: string;
  lastLoginTime?: Date;
  locale?: string;
  registerType?: RegisterType;
}
