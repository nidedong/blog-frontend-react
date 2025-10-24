import { message } from 'antd';
import i18n from './i18n';

export const validateImg = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error(`${i18n.t('tip.img_is_not_jpg_or_png')}!`);
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(`${i18n.t('tip.img_is_not_lessthan_2mb')}!`);
    return false;
  }
  return true;
};
