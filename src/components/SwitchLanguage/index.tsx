import { LanguageEnum } from '@/utils/i18n';
import { setLanguage } from '@/utils/storage';
import { useTranslation } from 'react-i18next';
import Button, { type ButtonProps } from '@mui/material/Button';

const SwitchLanguage: React.FC<ButtonProps> = (props) => {
  const { i18n } = useTranslation();

  const handleChange = () => {
    setLanguage(
      i18n.language === LanguageEnum.chinese ? LanguageEnum.english : LanguageEnum.chinese
    );
    location.reload();
  };

  return (
    <Button variant='outlined' size='small' onClick={handleChange} {...props}>
      {i18n.language === LanguageEnum.chinese ? 'English' : '中文'}
    </Button>
  );
};

export default SwitchLanguage;
