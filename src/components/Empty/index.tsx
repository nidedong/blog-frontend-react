import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Empty from '@/assets/empty.svg';
import { useTranslation } from 'react-i18next';

const Emtpy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Stack alignItems='center' sx={{ py: 4 }} spacing={2}>
      <Box component='img' sx={{ width: 300 }} src={Empty} />
      <Typography variant='subtitle1'>{t('app.no_data')}</Typography>
    </Stack>
  );
};

export default Emtpy;
