import { StorageEnum } from '@/constants/storage';
import { LanguageEnum } from './i18n';
import { IUserInfo } from '@/types';

export const getLanguage = () => localStorage.getItem(StorageEnum.language);

export const setLanguage = (lng: LanguageEnum) => {
  localStorage.setItem(StorageEnum.language, lng);
};

export const getUserInfo = (): IUserInfo | undefined =>
  JSON.parse(localStorage.getItem(StorageEnum.userInfo) ?? '{}');

export const setUserInfo = (user: IUserInfo | undefined) =>
  localStorage.setItem(StorageEnum.userInfo, JSON.stringify(user ?? {}));
