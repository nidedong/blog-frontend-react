import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import cn from '@/locales/zh-CN.json';
import { getLanguage } from './storage';

export enum LanguageEnum {
  english = 'en',
  chinese = 'cn',
}

const defaultLng = getLanguage() ?? LanguageEnum.chinese;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: defaultLng,
    // 没那么多功能，暂不使用namespace
    // ns: [],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {
      [LanguageEnum.chinese]: {
        translation: cn,
      },
      [LanguageEnum.english]: {
        translation: en,
      },
    },
  });

export default i18n;
