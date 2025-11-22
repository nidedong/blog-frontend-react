import { ALL_VALUE } from '@/constants';
import i18n from '@/utils/i18n';
import { ToggleButtonOwnProps } from '@mui/material/ToggleButton';

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

export const friendOptions: ToggleButtonOwnProps[] = [
  {
    value: ALL_VALUE,
    children: i18n.t('options.all'),
  },
  {
    value: FriendReqStatus.Waiting,
    children: i18n.t('options.undetermined'),
  },
];
