import { LanguageEnum } from '@/utils/i18n';
import { setLanguage } from '@/utils/storage';
import { useTranslation } from 'react-i18next';
import Chip, { type ChipProps } from '@mui/material/Chip';

const SwitchLanguage: React.FC<ChipProps> = (props) => {
  const { i18n } = useTranslation();

  const handleChange = () => {
    setLanguage(
      i18n.language === LanguageEnum.chinese ? LanguageEnum.english : LanguageEnum.chinese
    );
    location.reload();
  };

  return (
    <Chip
      label={i18n.language === LanguageEnum.chinese ? 'English' : '中文'}
      variant='outlined'
      size='medium'
      onClick={handleChange}
      {...props}
    ></Chip>
  );
};

export default SwitchLanguage;
