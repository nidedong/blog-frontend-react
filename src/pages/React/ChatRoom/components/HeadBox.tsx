import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const HeaderBox = styled(Box)(({ theme }) => {
  return {
    borderBottom: `1px solid ${theme.vars?.palette.divider}`,
    height: 53,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  };
});

export default HeaderBox;
