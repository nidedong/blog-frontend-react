import { LanguageEnum } from '@/utils/i18n';
import { setLanguage } from '@/utils/storage';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const SwitchLanguage = () => {
  const { i18n } = useTranslation();

  const handleChange = () => {
    setLanguage(
      i18n.language === LanguageEnum.chinese ? LanguageEnum.english : LanguageEnum.chinese
    );
    location.reload();
  };

  return (
    <Button size='small' onClick={handleChange}>
      {i18n.language === LanguageEnum.chinese ? 'English' : '中文'}
    </Button>
  );
};

export default SwitchLanguage;
