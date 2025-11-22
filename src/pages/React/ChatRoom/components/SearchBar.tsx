import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const SearchBar = () => {
  return (
    <Box sx={{ p: 1, borderBottom: (theme) => `1px solid ${theme.vars?.palette.divider}` }}>
      <Button fullWidth size='small' variant='outlined'>
        寻找或开启新的对话TODO
      </Button>
    </Box>
  );
};

export default SearchBar;
