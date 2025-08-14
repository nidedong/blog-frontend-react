import { EMPTY_VALUE } from '@/constants';
import { isNil } from 'lodash-es';

export const safeShowValue = (
  value: any,
  defaultValue: React.ReactNode = EMPTY_VALUE
): React.ReactNode => {
  if (isNil(value)) {
    return defaultValue;
  }
  return value;
};
