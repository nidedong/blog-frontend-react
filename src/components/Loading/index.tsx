import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <Box sx={{ pt: 12, textAlign: 'center' }}>
      <CircularProgress />
    </Box>
  );
};

export default Loading;
