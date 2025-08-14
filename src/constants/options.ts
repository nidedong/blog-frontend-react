import { ProFormRadioGroupProps } from '@ant-design/pro-components';
import i18n from '@/utils/i18n';

export const genderOptions: ProFormRadioGroupProps['options'] = [
  {
    label: i18n.t('options.gender_man'),
    value: 1,
  },
  {
    label: i18n.t('options.gender_woman'),
    value: 0,
  },
];
