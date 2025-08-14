import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Result
      status='404'
      title='404'
      subTitle={t('user.404msg')}
      extra={<Button type='primary'>{t('user.back_home')}</Button>}
    />
  );
};

export default NotFound;
