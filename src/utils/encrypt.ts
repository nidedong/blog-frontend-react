import CryptoJS from 'crypto-js';
import { isNil } from 'lodash-es';

export const encryptPassword = (password: string | undefined) => {
  if (isNil(password)) return undefined;

  return CryptoJS.SHA256(password).toString();
};
